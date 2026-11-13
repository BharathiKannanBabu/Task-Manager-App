import { create } from 'zustand';
import { ITask, ICategory, IDashboardStats, ViewMode, Priority, Status } from '../types/index.js';
import { taskService } from '../services/taskService.js';
import { categoryService } from '../services/categoryService.js';
import { statsService } from '../services/statsService.js';

interface TaskFilters {
  search: string;
  category: string;
  priority: string;
  status: string;
  tag: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface TaskState {
  tasks: ITask[];
  categories: ICategory[];
  stats: IDashboardStats | null;
  activeView: ViewMode;
  filters: TaskFilters;
  isLoading: boolean;
  isStatsLoading: boolean;
  selectedTask: ITask | null;
  isCreateModalOpen: boolean;
  isDetailModalOpen: boolean;
  isQuickAddOpen: boolean;
  isProfileModalOpen: boolean;
  isCategoryModalOpen: boolean;

  setActiveView: (view: ViewMode) => void;
  setFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void;
  resetFilters: () => void;

  setSelectedTask: (task: ITask | null) => void;
  setIsCreateModalOpen: (open: boolean) => void;
  setIsDetailModalOpen: (open: boolean) => void;
  setIsQuickAddOpen: (open: boolean) => void;
  setIsProfileModalOpen: (open: boolean) => void;
  setIsCategoryModalOpen: (open: boolean) => void;

  fetchTasks: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchStats: () => Promise<void>;

  createTask: (data: Partial<ITask>) => Promise<ITask>;
  updateTask: (id: string, data: Partial<ITask>) => Promise<ITask>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: Status) => Promise<void>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  reorderKanban: (taskId: string, newStatus: Status, newOrder?: number) => Promise<void>;

  createCategory: (data: { name: string; color?: string; icon?: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const defaultFilters: TaskFilters = {
  search: '',
  category: 'All',
  priority: 'All',
  status: 'All',
  tag: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  categories: [],
  stats: null,
  activeView: 'dashboard',
  filters: defaultFilters,
  isLoading: false,
  isStatsLoading: false,
  selectedTask: null,
  isCreateModalOpen: false,
  isDetailModalOpen: false,
  isQuickAddOpen: false,
  isProfileModalOpen: false,
  isCategoryModalOpen: false,

  setActiveView: (view) => {
    set({ activeView: view });
    get().fetchTasks();
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().fetchTasks();
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().fetchTasks();
  },

  setSelectedTask: (task) => set({ selectedTask: task }),
  setIsCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
  setIsDetailModalOpen: (open) => set({ isDetailModalOpen: open }),
  setIsQuickAddOpen: (open) => set({ isQuickAddOpen: open }),
  setIsProfileModalOpen: (open) => set({ isProfileModalOpen: open }),
  setIsCategoryModalOpen: (open) => set({ isCategoryModalOpen: open }),

  fetchTasks: async () => {
    const { activeView, filters } = get();
    set({ isLoading: true });

    try {
      let viewParam: string | undefined = undefined;
      if (['today', 'upcoming', 'overdue', 'completed'].includes(activeView)) {
        viewParam = activeView;
      }

      const res = await taskService.getTasks({
        search: filters.search || undefined,
        category: filters.category !== 'All' ? filters.category : undefined,
        priority: filters.priority !== 'All' ? filters.priority : undefined,
        status: filters.status !== 'All' ? filters.status : undefined,
        tag: filters.tag || undefined,
        view: viewParam,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit: 100,
      });

      set({ tasks: res.data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const res = await categoryService.getCategories();
      set({ categories: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  fetchStats: async () => {
    try {
      set({ isStatsLoading: true });
      const res = await statsService.getDashboardStats();
      set({ stats: res.data, isStatsLoading: false });
    } catch (err) {
      console.error(err);
      set({ isStatsLoading: false });
    }
  },

  createTask: async (data) => {
    const res = await taskService.createTask(data);
    set((state) => ({ tasks: [res.data, ...state.tasks] }));
    get().fetchStats();
    return res.data;
  },

  updateTask: async (id, data) => {
    const res = await taskService.updateTask(id, data);
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? res.data : t)),
      selectedTask: state.selectedTask?._id === id ? res.data : state.selectedTask,
    }));
    get().fetchStats();
    return res.data;
  },

  deleteTask: async (id) => {
    await taskService.deleteTask(id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== id),
      selectedTask: state.selectedTask?._id === id ? null : state.selectedTask,
      isDetailModalOpen: state.selectedTask?._id === id ? false : state.isDetailModalOpen,
    }));
    get().fetchStats();
  },

  updateTaskStatus: async (id, status) => {
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? { ...t, status } : t)),
    }));
    try {
      const res = await taskService.updateTaskStatus(id, status);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? res.data : t)),
        selectedTask: state.selectedTask?._id === id ? res.data : state.selectedTask,
      }));
      get().fetchStats();
    } catch (err) {
      get().fetchTasks();
    }
  },

  toggleSubtask: async (taskId, subtaskId) => {
    const res = await taskService.toggleSubtask(taskId, subtaskId);
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === taskId ? res.data : t)),
      selectedTask: state.selectedTask?._id === taskId ? res.data : state.selectedTask,
    }));
    get().fetchStats();
  },

  reorderKanban: async (taskId, newStatus, newOrder) => {
    // Optimistic local update
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === taskId ? { ...t, status: newStatus, order: newOrder ?? t.order } : t
      ),
    }));

    try {
      const res = await taskService.reorderKanban(taskId, newStatus, newOrder);
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? res.data : t)),
      }));
      get().fetchStats();
    } catch (err) {
      get().fetchTasks();
    }
  },

  createCategory: async (data) => {
    const res = await categoryService.createCategory(data);
    set((state) => ({ categories: [...state.categories, res.data] }));
  },

  deleteCategory: async (id) => {
    await categoryService.deleteCategory(id);
    set((state) => ({ categories: state.categories.filter((c) => c._id !== id) }));
  },
}));
