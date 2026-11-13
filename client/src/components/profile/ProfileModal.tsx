import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useTaskStore } from '../../store/useTaskStore.js';
import { Modal } from '../ui/Modal.js';
import { User, Lock, Sparkles, Bell, CheckCircle2 } from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuthStore();
  const { isProfileModalOpen, setIsProfileModalOpen } = useTaskStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status message
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      await updateProfile({ name, bio, avatar });
      setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      await changePassword({ currentPassword, newPassword });
      setStatusMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to change password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isProfileModalOpen}
      onClose={() => setIsProfileModalOpen(false)}
      title="Account & Settings"
      subtitle="Manage your profile, credentials, and app preferences"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/50 dark:bg-white/[0.06] border border-slate-300/40 dark:border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'security'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Preferences
          </button>
        </div>

        {/* Feedback Alert */}
        {statusMsg && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="space-y-3.5">
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03]">
              <img
                src={avatar || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt="Avatar Preview"
                className="w-14 h-14 rounded-full object-cover border-2 border-white/80 dark:border-white/20 shadow-sm"
              />
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 rounded-xl liquid-input text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl liquid-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2 rounded-xl liquid-input text-sm opacity-60 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bio / Status
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl liquid-input text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl liquid-btn-primary text-xs sm:text-sm font-semibold"
            >
              {isSubmitting ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl liquid-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl liquid-input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl liquid-input text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl liquid-btn-primary text-xs sm:text-sm font-semibold"
            >
              {isSubmitting ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03]">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Deadline Reminders
                </span>
                <span className="text-[11px] text-slate-400">
                  Notify me when tasks approach due dates
                </span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03]">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Task Completion Confetti
                </span>
                <span className="text-[11px] text-slate-400">
                  Celebrate task achievements with visual bursts
                </span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
