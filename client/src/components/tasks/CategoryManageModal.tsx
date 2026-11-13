import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore.js';
import { Modal } from '../ui/Modal.js';
import { Plus, Trash2, Folder, Sparkles } from 'lucide-react';

const PRESET_COLORS = [
  '#0071e3', // Apple Blue
  '#af52de', // Purple
  '#ff2d55', // Pink
  '#30b0c7', // Teal
  '#34c759', // Green
  '#ff9500', // Amber
  '#ff3b30', // Red
  '#5856d6', // Indigo
  '#8e8e93', // Gray
];

export const CategoryManageModal: React.FC = () => {
  const {
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    categories,
    createCategory,
    deleteCategory,
  } = useTaskStore();

  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createCategory({
        name: name.trim(),
        color: selectedColor,
      });
      setName('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isCategoryModalOpen}
      onClose={() => setIsCategoryModalOpen(false)}
      title="Manage Categories"
      subtitle="Organize tasks into personalized workspace categories"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Create new category */}
        <form onSubmit={handleCreate} className="space-y-3 p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Create Custom Category
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Design System, Fitness, Clients"
              className="flex-1 px-3 py-1.5 rounded-xl liquid-input text-xs"
            />
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-3.5 py-1.5 rounded-xl liquid-btn-primary text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Color palette picker */}
          <div>
            <span className="block text-[11px] text-slate-500 mb-1.5 font-medium">
              Choose Color Theme
            </span>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    selectedColor === c ? 'scale-125 ring-2 ring-offset-2 ring-blue-500' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </form>

        {/* Existing categories list */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Active Categories
          </h4>
          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/50 dark:bg-white/[0.04] border border-white/60 dark:border-white/5 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color, boxShadow: `0 0 6px ${cat.color}80` }}
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {cat.name}
                  </span>
                  {cat.isDefault && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-white/10 text-slate-500">
                      Default
                    </span>
                  )}
                </div>

                {!cat.isDefault && (
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
