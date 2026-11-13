import { Category } from '../models/Category.js';
import { Task } from '../models/Task.js';
import { Notification } from '../models/Notification.js';
import mongoose from 'mongoose';

export const DEFAULT_CATEGORIES = [
  { name: 'Work', color: '#0071e3', icon: 'Briefcase' },
  { name: 'Personal', color: '#af52de', icon: 'User' },
  { name: 'Development', color: '#30b0c7', icon: 'Code' },
  { name: 'Meetings', color: '#ff9500', icon: 'Users' },
  { name: 'Learning', color: '#34c759', icon: 'BookOpen' },
  { name: 'Shopping', color: '#ff2d55', icon: 'ShoppingBag' },
  { name: 'Other', color: '#8e8e93', icon: 'Layers' },
];

export const seedUserSampleData = async (userId: string): Promise<void> => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Check if categories already exist for user
  const existingCategories = await Category.find({ userId: userObjectId });
  if (existingCategories.length === 0) {
    const categoriesToInsert = DEFAULT_CATEGORIES.map((cat, index) => ({
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      userId: userObjectId,
      isDefault: true,
      order: index,
    }));
    await Category.insertMany(categoriesToInsert);
  }

  // Check if tasks already exist
  const existingTasks = await Task.countDocuments({ userId: userObjectId });
  if (existingTasks === 0) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const inThreeDays = new Date(today);
    inThreeDays.setDate(inThreeDays.getDate() + 3);
    const inFiveDays = new Date(today);
    inFiveDays.setDate(inFiveDays.getDate() + 5);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const sampleTasks = [
      {
        title: 'Design Liquid Glass Component System',
        description: 'Implement translucent frosted cards, backdrop blur tokens, specular borders, and soft fluid ambient glows.',
        category: 'Development',
        priority: 'High',
        status: 'In Progress',
        startDate: now,
        dueDate: today,
        tags: ['UI/UX', 'Glassmorphism', 'DesignSystem', 'Tailwind'],
        subtasks: [
          { title: 'Define CSS backdrop-blur variables', completed: true },
          { title: 'Create translucent navigation bar', completed: true },
          { title: 'Calibrate light and dark mode refraction layers', completed: false },
          { title: 'Add fluid micro-interactions with Framer Motion', completed: false },
        ],
        notes: 'Targeting Apple macOS Sequoia & iOS 18 translucent design guidelines.',
        userId: userObjectId,
        order: 0,
      },
      {
        title: 'Prepare Q4 Product Architecture Review',
        description: 'Synthesize architecture roadmap, micro-frontend performance benchmarks, and cloud latency improvements.',
        category: 'Work',
        priority: 'Urgent',
        status: 'Todo',
        startDate: now,
        dueDate: tomorrow,
        tags: ['Architecture', 'Leadership', 'Roadmap'],
        subtasks: [
          { title: 'Draft executive summary slide deck', completed: false },
          { title: 'Review MongoDB sharding & indexing strategies', completed: false },
          { title: 'Align with Engineering Leads on API specifications', completed: false },
        ],
        notes: 'Meeting scheduled with VP of Engineering tomorrow at 3 PM.',
        userId: userObjectId,
        order: 1,
      },
      {
        title: 'Sprint Planning & Backlog Grooming',
        description: 'Prioritize upcoming feature delivery sprints and assign story points to engineering squads.',
        category: 'Meetings',
        priority: 'Medium',
        status: 'Todo',
        startDate: now,
        dueDate: inThreeDays,
        tags: ['Agile', 'Scrum', 'Planning'],
        subtasks: [
          { title: 'Review user feedback tickets', completed: true },
          { title: 'Estimate story points for Kanban features', completed: false },
          { title: 'Finalize Sprint 42 capacity matrix', completed: false },
        ],
        notes: 'Coordinate with QA on automation requirements.',
        userId: userObjectId,
        order: 2,
      },
      {
        title: 'Complete Modern Type-Safe GraphQL Masterclass',
        description: 'Study advanced schema stitching, Apollo Federation, and subscription optimization patterns.',
        category: 'Learning',
        priority: 'Low',
        status: 'Review',
        startDate: threeDaysAgo,
        dueDate: inFiveDays,
        tags: ['GraphQL', 'TypeScript', 'Education'],
        subtasks: [
          { title: 'Complete Module 1-4 core concepts', completed: true },
          { title: 'Build reference federated gateway', completed: true },
          { title: 'Submit certification final project', completed: false },
        ],
        notes: 'Course access valid through end of the month.',
        userId: userObjectId,
        order: 3,
      },
      {
        title: 'Review Studio Lighting & Ergonomic Desk Setup',
        description: 'Evaluate curved OLED monitor mounts and ambient light bars for workspace ergonomics.',
        category: 'Personal',
        priority: 'Low',
        status: 'Completed',
        startDate: threeDaysAgo,
        dueDate: yesterday,
        completedAt: yesterday,
        tags: ['Setup', 'Hardware', 'Productivity'],
        subtasks: [
          { title: 'Measure desk depth and monitor arm clearances', completed: true },
          { title: 'Order monitor light bar with auto-dimming', completed: true },
        ],
        notes: 'Delivered and configured yesterday.',
        userId: userObjectId,
        order: 4,
      },
      {
        title: 'Monthly Cloud Infrastructure Cost Audit',
        description: 'Audit idle computing instances, unattached persistent disks, and CDN egress allocations.',
        category: 'Work',
        priority: 'Urgent',
        status: 'Todo',
        startDate: threeDaysAgo,
        dueDate: yesterday, // Overdue intentionally for notification and overdue list showcase
        tags: ['DevOps', 'CostOptimization', 'Audit'],
        subtasks: [
          { title: 'Analyze billing alerts breakdown', completed: true },
          { title: 'Prune orphaned container images', completed: false },
        ],
        notes: 'Needs immediate attention to prevent budget overruns.',
        userId: userObjectId,
        order: 5,
      },
    ];

    const createdTasks = await Task.insertMany(sampleTasks);

    // Create notifications for the user
    await Notification.insertMany([
      {
        userId: userObjectId,
        title: 'Task Overdue: Cloud Cost Audit',
        message: 'The monthly infrastructure audit was due yesterday. Please review soon.',
        type: 'overdue',
        taskId: createdTasks[5]._id,
        isRead: false,
      },
      {
        userId: userObjectId,
        title: 'Upcoming Deadline Today',
        message: 'Liquid Glass Component System is due today by 5:00 PM.',
        type: 'deadline',
        taskId: createdTasks[0]._id,
        isRead: false,
      },
      {
        userId: userObjectId,
        title: 'Task Completed! 🎉',
        message: 'You completed "Review Studio Lighting & Ergonomic Desk Setup". Great job!',
        type: 'completed',
        taskId: createdTasks[4]._id,
        isRead: true,
      },
      {
        userId: userObjectId,
        title: 'Welcome to Liquid Flow',
        message: 'Experience next-gen productivity with Apple Liquid Glass design and real-time task orchestration.',
        type: 'system',
        isRead: true,
      },
    ]);
  }
};
