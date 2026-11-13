export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type Status = 'Todo' | 'In Progress' | 'Review' | 'Completed';
export type Theme = 'light' | 'dark' | 'system';
export type ViewMode =
  | 'dashboard'
  | 'all'
  | 'my-tasks'
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'overdue'
  | 'kanban'
  | 'calendar';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  preferences?: {
    theme: Theme;
    emailNotifications: boolean;
    soundEnabled: boolean;
  };
  createdAt?: string;
}

export interface ISubtask {
  _id?: string;
  title: string;
  completed: boolean;
}

export interface IAttachment {
  _id?: string;
  name: string;
  url: string;
  type?: string;
  size?: number;
}

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  category: string;
  priority: Priority;
  status: Status;
  startDate?: string | null;
  dueDate?: string | null;
  tags: string[];
  subtasks: ISubtask[];
  attachments: IAttachment[];
  notes?: string;
  completedAt?: string | null;
  order: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  color: string;
  icon?: string;
  userId?: string | null;
  isDefault: boolean;
  order: number;
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deadline' | 'overdue' | 'completed' | 'system' | 'reminder';
  taskId?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface IDashboardStats {
  summary: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    todayTasks: number;
    completionRate: number;
  };
  weeklyChartData: Array<{
    day: string;
    date: string;
    completed: number;
  }>;
  upcomingDeadlines: ITask[];
  recentActivities: INotification[];
  priorityStats: Record<Priority, number>;
  categoryStats: Record<string, number>;
}
