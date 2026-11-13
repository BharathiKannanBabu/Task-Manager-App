import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/useTaskStore.js';
import { Modal } from '../ui/Modal.js';
import { PriorityBadge, StatusBadge, CategoryBadge } from '../ui/Badge.js';
import { Priority, Status } from '../../types/index.js';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  Save,
  CheckSquare,
  Plus,
  FileText,
  Tag,
} from 'lucide-react';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';

export const TaskDetailModal: React.FC = () => {
  const {
    selectedTask,
    isDetailModalOpen,
    setIsDetailModalOpen,
    updateTask,
    deleteTask,
    toggleSubtask,
    updateTaskStatus,
    categories,
  } = useTaskStore();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<Status>('Todo');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || '');
      setCategory(selectedTask.category);
      setPriority(selectedTask.priority);
      setStatus(selectedTask.status);
      setDueDate(
        selectedTask.dueDate
          ? new Date(selectedTask.dueDate).toISOString().split('T')[0]
          : ''
      );
      setNotes(selectedTask.notes || '');
      setIsEditing(false);
    }
  }, [selectedTask]);

  if (!selectedTask) return null;

  const categoryObj = categories.find((c) => c.name === selectedTask.category);
  const isCompleted = selectedTask.status === 'Completed';

  const handleToggleStatus = async () => {
    const nextStatus: Status = isCompleted ? 'Todo' : 'Completed';
    await updateTaskStatus(selectedTask._id, nextStatus);

    if (nextStatus === 'Completed') {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!title.trim()) return;
    await updateTask(selectedTask._id, {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      notes: notes.trim(),
    });
    setIsEditing(false);
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    const currentSubtasks = selectedTask.subtasks || [];
    await updateTask(selectedTask._id, {
      subtasks: [...currentSubtasks, { title: newSubtask.trim(), completed: false }],
    });
    setNewSubtask('');
  };

  const handleDeleteSubtask = async (subtaskId?: string) => {
    if (!subtaskId) return;
    const filtered = selectedTask.subtasks.filter((s) => s._id !== subtaskId);
    await updateTask(selectedTask._id, { subtasks: filtered });
  };

  return (
    <Modal
      isOpen={isDetailModalOpen}
      onClose={() => setIsDetailModalOpen(false)}
      title={isEditing ? 'Edit Task' : undefined}
      maxWidth="2xl"
    >
      <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
        {/* Header / Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge
              category={selectedTask.category}
              color={categoryObj?.color || '#0071e3'}
            />
            <PriorityBadge priority={selectedTask.priority} />
            <StatusBadge status={selectedTask.status} />
          </div>

          <div className="flex items-center gap-1.5">
            {!isEditing ? (
              <>
                <button
                  onClick={handleToggleStatus}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                      : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? 'Mark Pending' : 'Mark Complete'}</span>
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTask(selectedTask._id)}
                  className="p-1.5 text-slate-500 hover:text-rose-500 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl liquid-btn-primary text-xs font-semibold"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            )}
          </div>
        </div>

        {/* Title & Description */}
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl liquid-input text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl liquid-input text-xs resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl liquid-input text-xs"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-3 py-1.5 rounded-xl liquid-input text-xs"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl liquid-input text-xs"
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3
              className={`text-xl sm:text-2xl font-bold ${
                isCompleted
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {selectedTask.title}
            </h3>
            {selectedTask.description && (
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {selectedTask.description}
              </p>
            )}
          </div>
        )}

        {/* Due Date & Info Grid */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <div>
              <span className="text-slate-400 block text-[10px]">Due Date</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedTask.dueDate
                  ? format(new Date(selectedTask.dueDate), 'MMMM do, yyyy')
                  : 'No deadline set'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <div>
              <span className="text-slate-400 block text-[10px]">Created</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {format(new Date(selectedTask.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>

        {/* Subtasks Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
              Subtasks ({selectedTask.subtasks?.filter((s) => s.completed).length || 0}/
              {selectedTask.subtasks?.length || 0})
            </h4>
          </div>

          <div className="space-y-1.5">
            {selectedTask.subtasks?.map((subtask) => (
              <div
                key={subtask._id}
                onClick={() => subtask._id && toggleSubtask(selectedTask._id, subtask._id)}
                className="group flex items-center justify-between p-2.5 rounded-xl bg-white/50 dark:bg-white/[0.04] hover:bg-white/80 dark:hover:bg-white/[0.08] transition-colors cursor-pointer border border-white/60 dark:border-white/5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {subtask.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  <span
                    className={`text-xs ${
                      subtask.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSubtask(subtask._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Quick add subtask input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                placeholder="Add new subtask item..."
                className="flex-1 px-3 py-1.5 rounded-xl liquid-input text-xs"
              />
              <button
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-xl liquid-btn-primary text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        {selectedTask.tags && selectedTask.tags.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
              <Tag className="w-3.5 h-3.5 text-blue-500" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedTask.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            Notes & Scratchpad
          </h4>
          {isEditing ? (
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl liquid-input text-xs resize-none"
            />
          ) : (
            <div className="p-3 rounded-xl bg-white/40 dark:bg-white/[0.03] border border-white/60 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
              {selectedTask.notes || 'No notes attached to this task.'}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
