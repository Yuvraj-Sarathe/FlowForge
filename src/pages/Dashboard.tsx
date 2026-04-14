import React, { useState } from 'react';
import { useTasks, Task } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import { QuickAdd } from '../components/QuickAdd';
import { TaskDetailModal } from '../components/TaskDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, CalendarBlank, Tag } from '@phosphor-icons/react';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { tasks, updateTask, isOnline } = useTasks();
  const { syncId } = useAuth();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const incompleteTasks = tasks.filter(t => t.status !== 'done');
  const completedTasks = tasks.filter(t => t.status === 'done');
  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="p-10 max-w-6xl mx-auto min-h-[100dvh]">
      <header className="mb-12 flex items-end justify-between">
        <div>
          <h1 className="text-[56px] font-bold tracking-[-0.04em] leading-[0.9] text-app-text mb-4">
            Focus. <span className="text-app-muted">Flow.</span>
          </h1>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-app-muted">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-app-primary' : 'bg-amber-500'}`} />
            <span>{isOnline ? 'Synced:' : 'Offline Mode'}</span>
            {isOnline && <span className="text-app-primary font-mono">{syncId || 'WOLF-4821-BLUE'}</span>}
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-app-muted font-mono text-sm">{format(new Date(), 'EEEE, MMM do')}</p>
        </div>
      </header>

      <QuickAdd />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12">
        <div className="space-y-12">
          <section>
            <h2 className="text-xs uppercase tracking-[0.1em] font-bold text-app-muted mb-5 block">Today's Priorities</h2>
            <div className="flex flex-col">
              <AnimatePresence mode="popLayout">
                {incompleteTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-8 text-center text-app-muted"
                  >
                    No pending tasks. You're all caught up!
                  </motion.div>
                ) : (
                  incompleteTasks.map((task, i) => (
                    <TaskRow key={task.id} task={task} index={i} onToggle={() => updateTask(task.id, { status: 'done' })} onClick={() => setSelectedTaskId(task.id)} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>

          {completedTasks.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.1em] font-bold text-app-muted mb-5 block">Completed</h2>
              <div className="flex flex-col opacity-60">
                <AnimatePresence mode="popLayout">
                  {completedTasks.map((task, i) => (
                    <TaskRow key={task.id} task={task} index={i} onToggle={() => updateTask(task.id, { status: 'todo' })} onClick={() => setSelectedTaskId(task.id)} />
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-10">
          <div className="bg-gradient-to-br from-app-primary to-app-primary/80 rounded-[24px] p-8 text-app-primary-fg text-center shadow-[0_20px_40px_-12px_rgba(13,148,136,0.25)]">
            <h3 className="text-xs uppercase tracking-[0.1em] opacity-80 mb-2">Productivity Score</h3>
            <div className="text-[64px] font-bold tracking-[-0.02em] my-2 leading-none">
              {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
            </div>
            <p className="text-sm opacity-90">Tasks completed today</p>
          </div>
          
          <div className="border-t border-app-border pt-6">
             <span className="text-xs uppercase tracking-[0.1em] font-bold text-app-muted mb-5 block">Performance</span>
             <div className="flex justify-between py-3 border-b border-app-surface">
                 <span className="text-sm text-app-muted">Tasks Completed</span>
                 <span className="text-sm font-semibold text-app-text">{completedTasks.length} / {tasks.length}</span>
             </div>
             <div className="flex justify-between py-3 border-b border-app-surface">
                 <span className="text-sm text-app-muted">Focus Multiplier</span>
                 <span className="text-sm font-semibold text-app-primary">1.4x</span>
             </div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {selectedTask && (
          <TaskDetailModal 
            task={selectedTask} 
            onClose={() => setSelectedTaskId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const TaskRow = ({ task, index, onToggle, onClick }: { task: Task; index: number; onToggle: () => void; onClick: () => void }) => {
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: index * 0.05 }}
      className="group flex items-center gap-4 py-4 border-b border-app-border transition-all cursor-pointer hover:bg-app-surface px-2 -mx-2 rounded-xl"
      onClick={onClick}
    >
      <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="shrink-0 transition-colors">
        {task.status === 'done' ? (
          <div className="w-5 h-5 border-2 border-app-primary bg-app-primary rounded-md flex items-center justify-center">
            <CheckCircle weight="bold" className="w-4 h-4 text-app-primary-fg" />
          </div>
        ) : (
          <div className="w-5 h-5 border-2 border-app-border rounded-md group-hover:border-app-primary transition-colors" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-base font-medium mb-1 truncate ${task.status === 'done' ? 'line-through text-app-muted/80' : 'text-app-text'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-3 text-[13px] text-app-muted">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <CalendarBlank className="w-3 h-3" />
              {format(new Date(task.dueDate), 'MMM d, h:mm a')}
            </div>
          )}
          {totalSubtasks > 0 && (
            <span className="px-2 py-0.5 rounded bg-app-surface text-[11px] font-semibold text-app-muted">
              {completedSubtasks}/{totalSubtasks} subtasks
            </span>
          )}
          {task.tags?.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded bg-app-surface text-[11px] font-semibold text-app-muted">{tag}</span>
          ))}
          {task.priority === 'high' && (
            <span className="px-2 py-0.5 rounded bg-red-100 text-[11px] font-semibold text-red-600">! High</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
