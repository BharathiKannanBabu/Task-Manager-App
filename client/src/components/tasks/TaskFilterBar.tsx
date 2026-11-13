import React from 'react';
import { useTaskStore } from '../../store/useTaskStore.js';
import {
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
} from 'lucide-react';

interface TaskFilterBarProps {
  layout: 'grid' | 'list';
  onLayoutChange: (layout: 'grid' | 'list') => void;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({ layout, onLayoutChange }) => {
  const { filters, setFilter, resetFilters, categories } = useTaskStore();

  const isFiltered =
    filters.search ||
    filters.category !== 'All' ||
    filters.priority !== 'All' ||
    filters.status !== 'All';

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-2xl liquid-glass mb-6">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          placeholder="Filter by title, description, tags..."
          className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl liquid-input"
        />
      </div>

      {/* Filter Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category select */}
        <select
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}
          className="text-xs py-1.5 px-3 rounded-xl liquid-input bg-white/50 dark:bg-slate-800/50 cursor-pointer"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Priority select */}
        <select
          value={filters.priority}
          onChange={(e) => setFilter('priority', e.target.value)}
          className="text-xs py-1.5 px-3 rounded-xl liquid-input bg-white/50 dark:bg-slate-800/50 cursor-pointer"
        >
          <option value="All">All Priorities</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Status select */}
        <select
          value={filters.status}
          onChange={(e) => setFilter('status', e.target.value)}
          className="text-xs py-1.5 px-3 rounded-xl liquid-input bg-white/50 dark:bg-slate-800/50 cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Todo">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Sort select */}
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            setFilter('sortBy', sortBy);
            setFilter('sortOrder', sortOrder as 'asc' | 'desc');
          }}
          className="text-xs py-1.5 px-3 rounded-xl liquid-input bg-white/50 dark:bg-slate-800/50 cursor-pointer"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="dueDate-asc">Due Date (Earliest)</option>
          <option value="dueDate-desc">Due Date (Latest)</option>
          <option value="title-asc">Title (A-Z)</option>
        </select>

        {/* Reset filter button */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            title="Reset Filters"
            className="flex items-center gap-1 text-xs py-1.5 px-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}

        {/* Grid vs List toggle */}
        <div className="flex items-center p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10">
          <button
            onClick={() => onLayoutChange('grid')}
            title="Grid View"
            className={`p-1.5 rounded-lg transition-colors ${
              layout === 'grid'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onLayoutChange('list')}
            title="List View"
            className={`p-1.5 rounded-lg transition-colors ${
              layout === 'list'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
