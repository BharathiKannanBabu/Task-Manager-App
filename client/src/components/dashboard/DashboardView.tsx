import React, { useEffect } from 'react';
import { useTaskStore } from '../../store/useTaskStore.js';
import { WelcomeBanner } from './WelcomeBanner.js';
import { StatCards } from './StatCards.js';
import { WeeklyChart } from './WeeklyChart.js';
import { UpcomingDeadlines } from './UpcomingDeadlines.js';
import { RecentActivity } from './RecentActivity.js';
import { motion } from 'framer-motion';

export const DashboardView: React.FC = () => {
  const { fetchStats, fetchCategories } = useTaskStore();

  useEffect(() => {
    fetchStats();
    fetchCategories();
  }, [fetchStats, fetchCategories]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      <WelcomeBanner />
      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <WeeklyChart />
          <UpcomingDeadlines />
        </div>
        <div className="space-y-6">
          <RecentActivity />
        </div>
      </div>
    </motion.div>
  );
};
