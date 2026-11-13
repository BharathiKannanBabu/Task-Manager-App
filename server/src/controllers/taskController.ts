import { Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { Task, ITask } from '../models/Task.js';
import { Notification } from '../models/Notification.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const subtaskSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'Subtask title cannot be empty'),
  completed: z.boolean().default(false),
});

const attachmentSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  url: z.string().url(),
  type: z.string().optional(),
  size: z.number().optional(),
});

const taskInputSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(150),
  description: z.string().max(2000).optional().default(''),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).default('Medium'),
  status: z.enum(['Todo', 'In Progress', 'Review', 'Completed']).default('Todo'),
  startDate: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  tags: z.array(z.string()).optional().default([]),
  subtasks: z.array(subtaskSchema).optional().default([]),
  attachments: z.array(attachmentSchema).optional().default([]),
  notes: z.string().max(3000).optional().default(''),
  order: z.number().optional().default(0),
});

export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const {
      search,
      category,
      priority,
      status,
      view,
      tag,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '50',
    } = req.query;

    const filter: Record<string, any> = {
      userId,
      isArchived: false,
    };

    // View specific filters
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (view === 'today') {
      filter.dueDate = { $gte: startOfToday, $lte: endOfToday };
    } else if (view === 'upcoming') {
      filter.dueDate = { $gt: endOfToday };
      filter.status = { $ne: 'Completed' };
    } else if (view === 'overdue') {
      filter.dueDate = { $lt: startOfToday };
      filter.status = { $ne: 'Completed' };
    } else if (view === 'completed') {
      filter.status = 'Completed';
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (priority && priority !== 'All') {
      filter.priority = priority;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { category: searchRegex },
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const sortOption: Record<string, 1 | -1> = {};
    const order = sortOrder === 'asc' ? 1 : -1;
    sortOption[sortBy as string] = order;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = taskInputSchema.parse(req.body);

    const highestOrder = await Task.findOne({ userId: req.userId })
      .sort({ order: -1 })
      .select('order');
    const nextOrder = highestOrder ? (highestOrder.order || 0) + 1 : 0;

    const task = await Task.create({
      ...validated,
      startDate: validated.startDate ? new Date(validated.startDate) : null,
      dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      userId: req.userId,
      order: validated.order ?? nextOrder,
      completedAt: validated.status === 'Completed' ? new Date() : null,
    });

    // Check if task is urgent or has an upcoming deadline today
    if (task.dueDate && task.status !== 'Completed') {
      const now = new Date();
      const diffHours = (new Date(task.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60);
      if (diffHours >= 0 && diffHours <= 24) {
        await Notification.create({
          userId: req.userId,
          title: `Upcoming Deadline: ${task.title}`,
          message: `Due soon on ${new Date(task.dueDate).toLocaleDateString()}`,
          type: 'deadline',
          taskId: task._id,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = taskInputSchema.partial().parse(req.body);

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    const previousStatus = task.status;

    // Apply updates
    Object.assign(task, {
      ...validated,
      startDate: validated.startDate !== undefined ? (validated.startDate ? new Date(validated.startDate) : null) : task.startDate,
      dueDate: validated.dueDate !== undefined ? (validated.dueDate ? new Date(validated.dueDate) : null) : task.dueDate,
    });

    // If transitioned to Completed
    if (task.status === 'Completed' && previousStatus !== 'Completed') {
      task.completedAt = new Date();
      await Notification.create({
        userId: req.userId,
        title: `Task Completed! 🎉`,
        message: `"${task.title}" was marked as completed.`,
        type: 'completed',
        taskId: task._id,
      });
    } else if (task.status !== 'Completed') {
      task.completedAt = undefined;
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    // Clean up related notifications
    await Notification.deleteMany({ taskId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    if (!['Todo', 'In Progress', 'Review', 'Completed'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid task status' });
      return;
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    const previousStatus = task.status;
    task.status = status;

    if (status === 'Completed' && previousStatus !== 'Completed') {
      task.completedAt = new Date();
      await Notification.create({
        userId: req.userId,
        title: `Task Completed! 🎉`,
        message: `"${task.title}" was completed!`,
        type: 'completed',
        taskId: task._id,
      });
    } else if (status !== 'Completed') {
      task.completedAt = undefined;
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleSubtask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { taskId, subtaskId } = req.params;
    const task = await Task.findOne({ _id: taskId, userId: req.userId });

    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    const subtask = task.subtasks.find((s) => s._id?.toString() === subtaskId);
    if (!subtask) {
      res.status(404).json({ success: false, message: 'Subtask not found' });
      return;
    }

    subtask.completed = !subtask.completed;
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Subtask updated',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const reorderKanbanTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { taskId, newStatus, newOrder } = req.body;
    if (!taskId || !newStatus) {
      res.status(400).json({ success: false, message: 'taskId and newStatus are required' });
      return;
    }

    const task = await Task.findOne({ _id: taskId, userId: req.userId });
    if (!task) {
      res.status(404).json({ success: false, message: 'Task not found' });
      return;
    }

    task.status = newStatus;
    if (newOrder !== undefined) {
      task.order = newOrder;
    }

    if (newStatus === 'Completed' && !task.completedAt) {
      task.completedAt = new Date();
    } else if (newStatus !== 'Completed') {
      task.completedAt = undefined;
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task repositioned successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
