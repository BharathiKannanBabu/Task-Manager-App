import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { Notification } from '../models/Notification.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Run parallel aggregation queries
    const [
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      todayTasks,
      upcomingDeadlines,
      recentActivities,
      priorityStats,
      categoryStats,
    ] = await Promise.all([
      Task.countDocuments({ userId, isArchived: false }),
      Task.countDocuments({ userId, status: 'Completed', isArchived: false }),
      Task.countDocuments({ userId, status: { $ne: 'Completed' }, isArchived: false }),
      Task.countDocuments({
        userId,
        dueDate: { $lt: startOfToday },
        status: { $ne: 'Completed' },
        isArchived: false,
      }),
      Task.countDocuments({
        userId,
        dueDate: { $gte: startOfToday, $lte: endOfToday },
        isArchived: false,
      }),
      Task.find({
        userId,
        dueDate: { $gte: startOfToday },
        status: { $ne: 'Completed' },
        isArchived: false,
      })
        .sort({ dueDate: 1 })
        .limit(5),
      Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(6),
      Task.aggregate([
        { $match: { userId, isArchived: false } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: { userId, isArchived: false } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
    ]);

    // Calculate weekly productivity (last 7 days completed tasks)
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const weeklyCompletions = await Task.aggregate([
      {
        $match: {
          userId,
          status: 'Completed',
          completedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Build complete 7-day array
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyChartData: Array<{ day: string; date: string; completed: number }> = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = weeklyCompletions.find((item) => item._id === dateStr);

      weeklyChartData.push({
        day: dayNames[d.getDay()],
        date: dateStr,
        completed: match ? match.count : 0,
      });
    }

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalTasks,
          completedTasks,
          pendingTasks,
          overdueTasks,
          todayTasks,
          completionRate,
        },
        weeklyChartData,
        upcomingDeadlines,
        recentActivities,
        priorityStats: priorityStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        categoryStats: categoryStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    next(error);
  }
};
