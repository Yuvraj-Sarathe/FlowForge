import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-app-surface/50 rounded-lg animate-pulse ${className}`} />
);

export const SkeletonText: React.FC<{ className?: string; width?: string }> = ({ 
  className = '', 
  width = 'w-full' 
}) => (
  <div className={`h-4 bg-app-surface/50 rounded animate-pulse ${width} ${className}`} />
);

export const SkeletonCircle: React.FC<{ size?: string }> = ({ size = 'w-10 h-10' }) => (
  <div className={`${size} bg-app-surface/50 rounded-full animate-pulse`} />
);

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-[100dvh]">
      {/* Header Skeleton */}
      <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <SkeletonText className="h-12 mb-4" width="w-48" />
          <SkeletonText className="h-4 mb-2" width="w-64" />
          <div className="flex gap-4 mt-4">
            <SkeletonText width="w-24" />
            <SkeletonText width="w-24" />
          </div>
        </div>
        <div className="flex gap-2">
          <SkeletonBox className="w-32 h-12" />
          <SkeletonBox className="w-32 h-12" />
        </div>
      </header>

      {/* Filters Skeleton */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <SkeletonBox className="w-32 h-10" />
        <SkeletonBox className="flex-1 h-10 min-w-[180px]" />
        <SkeletonBox className="w-32 h-10" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        {/* Task List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 py-4 border-b border-app-border/30"
            >
              <SkeletonCircle size="w-5 h-5" />
              <div className="flex-1">
                <SkeletonText className="mb-2" width="w-3/4" />
                <div className="flex gap-2">
                  <SkeletonBox className="w-16 h-5" />
                  <SkeletonBox className="w-16 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar Skeleton */}
        <aside className="flex flex-col gap-6">
          {/* Score Ring Skeleton */}
          <div className="bg-app-card border border-app-border/30 rounded-2xl p-8 flex items-center justify-center">
            <SkeletonCircle size="w-32 h-32" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-app-card border border-app-border/30 rounded-2xl p-5"
              >
                <SkeletonText className="mb-2" width="w-16" />
                <SkeletonText className="h-8 mb-1" width="w-12" />
                <SkeletonText width="w-20" />
              </motion.div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export const CalendarSkeleton: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-[100dvh]">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <SkeletonText className="h-12 mb-2" width="w-48" />
          <SkeletonText width="w-64" />
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <SkeletonBox key={i} className="w-24 h-20" />
          ))}
        </div>
      </header>

      <div className="bg-app-card border border-app-border/30 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-app-border/30">
          <div className="flex items-center gap-3">
            <SkeletonBox className="w-10 h-10" />
            <SkeletonText width="w-32" />
            <SkeletonBox className="w-10 h-10" />
          </div>
          <SkeletonBox className="w-32 h-10" />
        </div>

        <div className="grid grid-cols-7 border-b border-app-border/30">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3 text-center">
              <SkeletonText className="mx-auto" width="w-8" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="min-h-[100px] p-2 border-b border-r border-app-border/20">
              <SkeletonText className="mb-2" width="w-6" />
              <SkeletonBox className="h-6 mb-1" />
              <SkeletonBox className="h-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const KanbanSkeleton: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-[100dvh]">
      <header className="mb-8">
        <SkeletonText className="h-12 mb-2" width="w-48" />
        <SkeletonText width="w-64" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['To Do', 'In Progress', 'Done'].map((col, idx) => (
          <motion.div
            key={col}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col"
          >
            <div className="bg-app-surface rounded-t-2xl px-5 py-4 flex items-center justify-between">
              <SkeletonText width="w-24" />
              <SkeletonBox className="w-8 h-6" />
            </div>
            <div className="bg-app-surface/30 border-x border-b border-app-border/30 rounded-b-2xl p-4 min-h-[60vh]">
              {[1, 2, 3].map((i) => (
                <SkeletonBox key={i} className="h-24 mb-3" />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const SettingsSkeleton: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-[100dvh]">
      <header className="mb-8 flex justify-between">
        <div>
          <SkeletonText className="h-12 mb-2" width="w-48" />
          <SkeletonText width="w-64" />
        </div>
        <SkeletonBox className="w-32 h-10" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-app-card border border-app-border/30 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <SkeletonCircle />
              <SkeletonText width="w-32" />
            </div>
            <div className="space-y-4">
              <SkeletonBox className="h-12" />
              <SkeletonBox className="h-12" />
              <SkeletonBox className="h-12" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const TimerSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-6">
      <SkeletonBox className="w-full h-10 mb-4" />
      
      <div className="flex gap-2 mb-8 p-1 bg-app-surface rounded-full">
        {[1, 2, 3].map((i) => (
          <SkeletonBox key={i} className="w-24 h-10" />
        ))}
      </div>

      <SkeletonCircle size="w-64 h-64" className="mb-8" />

      <SkeletonText className="mb-8" width="w-32" />

      <div className="flex items-center gap-4">
        <SkeletonCircle size="w-12 h-12" />
        <SkeletonCircle size="w-16 h-16" />
        <SkeletonCircle size="w-12 h-12" />
      </div>
    </div>
  );
};

export const HabitsSkeleton: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-[100dvh]">
      <header className="mb-8">
        <SkeletonText className="h-12 mb-2" width="w-48" />
        <SkeletonText width="w-64" />
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBox key={i} className="h-24" />
        ))}
      </div>

      <div className="bg-app-card border border-app-border/30 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-8 border-b border-app-border/30 p-4">
          <SkeletonText width="w-16" />
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <SkeletonText key={i} className="mx-auto" width="w-8" />
          ))}
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="grid grid-cols-8 items-center py-4 border-b border-app-border/30">
            <div className="px-4 flex items-center gap-3">
              <SkeletonCircle size="w-6 h-6" />
              <SkeletonText width="w-24" />
            </div>
            {[1, 2, 3, 4, 5, 6, 7].map((j) => (
              <SkeletonBox key={j} className="mx-2 h-8" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
