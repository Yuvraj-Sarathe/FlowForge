'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Plus, Trash, Flame, Calendar } from '@phosphor-icons/react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from 'date-fns';
import { InfoCard } from '../components/InfoCard';

interface HabitColor { bg: string; text: string; border: string; }
interface Habit { id: string; name: string; color: HabitColor; createdAt: number; completions: Record<string, boolean>; streak: number; }

const HABIT_COLORS = [
  { bg: 'bg-emerald-50 dark:bg-emerald-950', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  { bg: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  { bg: 'bg-purple-50 dark:bg-purple-950', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  { bg: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  { bg: 'bg-pink-50 dark:bg-pink-950', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' },
  { bg: 'bg-cyan-50 dark:bg-cyan-950', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
];

const STORAGE_KEY = 'flowforge_habits';

function BentoCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-app-card border border-app-border/30 rounded-2xl ${className}`}>{children}</motion.div>;
}

function StreakRing({ streak, maxStreak, color }: { streak: number; maxStreak: number; color: string }) {
  const progress = maxStreak > 0 ? Math.min(streak / maxStreak, 1) : 0;
  const circumference = 2 * Math.PI * 36;
  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r="36" fill="none" stroke="var(--app-surface)" strokeWidth="6" />
        <motion.circle cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - progress * circumference }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div key={streak} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <Flame className={`w-6 h-6 ${streak > 0 ? color : 'text-app-muted'}`} />
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sublabel, delay, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; sublabel: string; delay: number; color: string }) {
  return (
    <motion.div className="bg-app-card border border-app-border/30 rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, type: 'spring', stiffness: 100, damping: 20 }}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} dark:bg-app-surface`}><Icon className="w-5 h-5 dark:text-app-primary" /></div>
        <span className="text-app-muted text-sm">{label}</span>
      </div>
      <div className="text-3xl font-bold text-app-text">{value}</div>
      <div className="text-xs text-app-muted mt-1">{sublabel}</div>
    </motion.div>
  );
}

function AddHabitModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (name: string) => void }) {
  const [name, setName] = useState('');
  
  if (!isOpen) return null;
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose} role="dialog" aria-modal="true" aria-label="Create new habit">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-app-card border border-app-border rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-app-text mb-4">Create New Habit</h2>
        <div className="space-y-4">
          <div><label htmlFor="habit-name" className="block text-sm font-medium text-app-text mb-2">Habit Name</label><input id="habit-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Exercise, Read, Meditate" className="w-full bg-app-surface border border-app-border/30 rounded-xl px-4 py-3 text-app-text focus:border-app-primary outline-none" autoFocus /></div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-app-surface text-app-text rounded-xl font-medium hover:bg-app-border transition-colors">Cancel</button>
            <button onClick={() => { if (name.trim()) { onAdd(name.trim()); setName(''); } }} disabled={!name.trim()} className="flex-1 px-4 py-2.5 bg-app-primary text-app-primary-fg rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50">Create</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const HabitsPage: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => { try { const stored = localStorage.getItem(STORAGE_KEY); return stored ? JSON.parse(stored) : []; } catch { return []; } });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(habits)); }, [habits]);

  const getDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');
  
  const calculateStreak = (habit: Habit): number => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = subDays(today, i);
      const key = getDateKey(date);
      if (habit.completions[key]) streak++;
      else if (i > 0) break;
    }
    return streak;
  };

  const toggleHabitCompletion = (habitId: string, date: Date = new Date()) => {
    const key = getDateKey(date);
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const newCompletions = { ...h.completions };
        if (newCompletions[key]) delete newCompletions[key];
        else newCompletions[key] = true;
        return { ...h, completions: newCompletions, streak: calculateStreak({ ...h, completions: newCompletions }) };
      }
      return h;
    }));
  };

  const deleteHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id));

  const todayKey = getDateKey(new Date());
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.completions[todayKey]).length;
    const totalStreaks = habits.reduce((sum, h) => sum + calculateStreak(h), 0);
    const longestStreak = Math.max(...habits.map(h => calculateStreak(h)), 0);
    return { totalHabits, completedToday, totalStreaks, longestStreak };
  }, [habits, todayKey]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-[100dvh]">
      <InfoCard
        id="habits"
        title="🔥 Build Better Habits"
        description="Track daily routines and build consistency. Check off habits each day to maintain your streak."
        tips={[
          "Start small - add 1-3 habits you want to build",
          "Check in daily to maintain your streak",
          "Use this for recurring activities like exercise, reading, or meditation"
        ]}
      />
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold tracking-tight text-app-text leading-[0.9]" tabIndex={-1}>Habits</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-app-muted mt-2">Build consistent daily routines</motion.p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Calendar} label="Today" value={`${stats.completedToday}/${stats.totalHabits}`} sublabel="completed" delay={0.1} color="bg-app-primary/10" />
        <StatCard icon={Flame} label="Streak Days" value={stats.totalStreaks} sublabel="total days" delay={0.2} color="bg-orange-50" />
        <StatCard icon={Flame} label="Best Streak" value={stats.longestStreak} sublabel="days" delay={0.3} color="bg-amber-50" />
        <motion.button onClick={() => setShowAddForm(true)} className="bg-gradient-to-br from-app-primary to-emerald-600 text-app-primary-fg rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg shadow-app-primary/20" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Plus className="w-8 h-8 mb-2" /><span className="font-semibold">Add Habit</span>
        </motion.button>
      </div>

      {/* Habits Grid */}
      <BentoCard>
        <div className="grid grid-cols-8 border-b border-app-border/30">
          <div className="p-4 text-xs font-semibold text-app-muted/50 uppercase tracking-wider">Habit</div>
          {weekDays.map((day, i) => <div key={i} className="p-4 text-center text-xs font-semibold text-app-muted/50 uppercase tracking-wider">{format(day, 'EEE')}</div>)}
        </div>

        {habits.length === 0 ? (
          <div className="p-16 text-center text-app-muted">
            <Flame className="w-12 h-12 mx-auto mb-4 text-app-muted/30" />
            <p className="mb-4">No habits yet. Start building your routine!</p>
            <motion.button onClick={() => setShowAddForm(true)} className="px-6 py-3 bg-app-primary text-app-primary-fg rounded-xl font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Create your first habit</motion.button>
          </div>
        ) : (
          <div className="divide-y divide-app-border/30">
            {habits.map((habit, idx) => (
              <motion.div key={habit.id} className="grid grid-cols-8 items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <div className="p-4 flex items-center gap-3">
                  <motion.button onClick={() => toggleHabitCompletion(habit.id)} className={`shrink-0 ${habit.completions[todayKey] ? 'text-app-primary' : 'text-app-muted'}`} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    {habit.completions[todayKey] ? <CheckCircle weight="fill" className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </motion.button>
                  <div>
                    <p className={`font-medium ${habit.completions[todayKey] ? 'text-app-muted line-through' : 'text-app-text'}`}>{habit.name}</p>
                    <div className="flex items-center gap-1 text-xs text-app-muted"><Flame className="w-3 h-3" /><span>{calculateStreak(habit)} day streak</span></div>
                  </div>
                </div>
                {weekDays.map((day, i) => {
                  const key = getDateKey(day);
                  const isCompleted = habit.completions[key];
                  const isFuture = day > new Date();
                  return (
                    <div key={i} className="p-2 text-center">
                      <motion.button onClick={() => !isFuture && toggleHabitCompletion(habit.id, day)} disabled={isFuture} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isCompleted ? `${habit.color.bg} ${habit.color.text}` : isFuture ? 'bg-transparent' : 'bg-app-surface/50 hover:bg-app-surface'}`} whileHover={!isFuture ? { scale: 1.1 } : {}} whileTap={!isFuture ? { scale: 0.9 } : {}}>
                        {isCompleted && <CheckCircle weight="fill" className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  );
                })}
                <div className="p-4 text-center">
                  <motion.button onClick={() => deleteHabit(habit.id)} className="p-2 text-app-muted hover:text-red-500 transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><Trash className="w-5 h-5" /></motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </BentoCard>

      <AnimatePresence>{showAddForm && <AddHabitModal isOpen={showAddForm} onClose={() => setShowAddForm(false)} onAdd={(name) => {
      const newHabit: Habit = { id: crypto.randomUUID(), name, color: HABIT_COLORS[habits.length % HABIT_COLORS.length], createdAt: Date.now(), completions: {}, streak: 0 };
      setHabits(prev => [...prev, newHabit]);
      setShowAddForm(false);
    }} />}</AnimatePresence>
    </div>
  );
};