'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  House, Timer, Link, Gear, Plus, CalendarBlank, CheckCircle, Heart, SquaresFour,
  Tag, Funnel, Square, Clock, ArrowCounterClockwise, MagnifyingGlass,
  Keyboard, LinkBreak, CloudArrowDown, CloudArrowUp, Devices, Bell,
  PaintBrush, Image as ImageIcon, Trash, Check, X, Question, Info,
  Lightning, Cloud, CalendarCheck, ListChecks, ArrowsClockwise
} from '@phosphor-icons/react';

function FeatureCard({ icon: Icon, title, description, delay }: { icon: React.ComponentType<{ className?: string; weight?: string }>; title: string; description: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, type: 'spring', stiffness: 100, damping: 20 }} className="p-5 bg-app-surface/50 rounded-xl hover:bg-app-surface transition-colors">
      <Icon className="w-6 h-6 text-app-primary mb-3" weight="duotone" />
      <h3 className="text-sm font-semibold text-app-text mb-1">{title}</h3>
      <p className="text-xs text-app-muted leading-relaxed">{description}</p>
    </motion.div>
  );
}

function ScreenCard({ title, icon: Icon, description, features, accent = 'text-app-primary' }: { title: string; icon: React.ComponentType<{ className?: string; weight?: string }>; description: string; features: { name: string; desc: string }[]; accent?: string }) {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-app-card border border-app-border/30 rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl bg-app-primary/10 flex items-center justify-center text-app-primary shrink-0">
          <Icon className="w-6 h-6" weight="duotone" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-app-text">{title}</h2>
          <p className="text-sm text-app-muted mt-1">{description}</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {features.map((f) => (
          <div key={f.name} className="flex items-start gap-3 py-2 px-3 bg-app-surface/50 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" weight="fill" />
            <div>
              <h4 className="text-xs font-medium text-app-text">{f.name}</h4>
              <p className="text-[11px] text-app-muted">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function ShortcutCard({ shortcuts }: { shortcuts: { key: string; action: string }[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-app-card border border-app-border/30 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-app-primary/10 flex items-center justify-center text-app-primary">
          <Keyboard className="w-6 h-6" weight="duotone" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-app-text">Keyboard Shortcuts</h2>
          <p className="text-sm text-app-muted">Navigate faster with keyboard shortcuts</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {shortcuts.map((s) => (
          <div key={s.key} className="flex items-center gap-2 py-2 px-3 bg-app-surface/50 rounded-lg">
            <kbd className="px-2 py-1 bg-app-bg border border-app-border/50 rounded text-xs font-mono text-app-text min-w-[28px] text-center">{s.key}</kbd>
            <span className="text-xs text-app-muted truncate">{s.action}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function QuickStartCard() {
  const steps = [
    { num: '1', title: 'Quick Add Tasks', desc: 'Type "Buy milk tomorrow 5pm" - natural language parsing handles dates & times' },
    { num: '2', title: 'Organize with Tags', desc: 'Add tags like #work, #personal to categorize and filter tasks easily' },
    { num: '3', title: 'Set Priorities', desc: 'Mark high priority tasks with ! for things that need immediate attention' },
    { num: '4', title: 'Use Focus Timer', desc: 'Try the Pomodoro timer for focused work sessions - 25min work, 5min break' },
  ];
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-app-primary/10 to-emerald-500/5 border border-app-primary/20 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <Lightning className="w-6 h-6 text-app-primary" weight="duotone" />
        <h2 className="text-xl font-bold text-app-text">Quick Start Guide</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {steps.map((step) => (
          <div key={step.num} className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-app-primary text-app-primary-fg text-xs font-bold flex items-center justify-center shrink-0">{step.num}</span>
            <div>
              <h4 className="text-sm font-semibold text-app-text">{step.title}</h4>
              <p className="text-xs text-app-muted">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export const Help: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-[100dvh]">
      <header className="mb-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold tracking-tight text-app-text leading-[0.9] mb-3 flex items-center gap-3">
          <Question className="w-10 h-10 text-app-primary" weight="duotone" />
          Help & Guide
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg text-app-muted">Learn how to use all features of FlowForge</motion.p>
      </header>

      <QuickStartCard />

      <div className="mt-10 space-y-6">
        <ScreenCard
          icon={House}
          title="Tasks (Dashboard)"
          description="Your main task management hub - view, search, filter, and manage all tasks in one place"
          features={[
            { name: 'Quick Add', desc: 'Add tasks with natural language like "Call mom tomorrow at 3pm"' },
            { name: 'Search & Filter', desc: 'Find tasks by keyword, filter by tags or priority' },
            { name: 'Sort Options', desc: 'Sort by created date, due date, or priority level' },
            { name: 'Bulk Actions', desc: 'Select multiple tasks to complete or delete at once' },
            { name: 'Timeline View', desc: 'See tasks scheduled for today in timeline format' },
          ]}
        />
        
        <ScreenCard
          icon={Timer}
          title="Focus (Pomodoro Timer)"
          description="Focus timer with customizable work and break sessions"
          features={[
            { name: 'Focus Sessions', desc: '25-minute work sessions (configurable in settings)' },
            { name: 'Short Breaks', desc: '5-minute breaks between sessions' },
            { name: 'Long Breaks', desc: '15-minute break after 4 completed sessions' },
            { name: 'Audio Alerts', desc: 'Sound notifications when session ends' },
            { name: 'Persistence', desc: 'Timer state saved - continues after refresh' },
          ]}
        />
        
        <ScreenCard
          icon={Square}
          title="Kanban Board"
          description="Drag-and-drop task management in columns"
          features={[
            { name: 'Three Columns', desc: 'To Do, In Progress, Done workflow' },
            { name: 'Drag & Drop', desc: 'Move tasks between columns to update status' },
            { name: 'Quick Complete', desc: 'Click checkmark to toggle task status' },
            { name: 'Visual Overview', desc: 'See all tasks at a glance by status' },
          ]}
        />
        
        <ScreenCard
          icon={CalendarBlank}
          title="Calendar"
          description="View tasks by date in a calendar grid"
          features={[
            { name: 'Month View', desc: 'See all tasks scheduled for each day' },
            { name: 'Task Dots', desc: 'Color-coded dots show tasks for each date' },
            { name: 'Navigate', desc: 'Move between months with arrows' },
            { name: 'Upcoming List', desc: 'See all upcoming tasks below calendar' },
          ]}
        />
        
        <ScreenCard
          icon={Heart}
          title="Habits"
          description="Build consistent daily routines with habit tracking"
          features={[
            { name: 'Create Habits', desc: 'Add habits like exercise, reading, meditation' },
            { name: 'Daily Check-in', desc: 'Mark habits complete each day' },
            { name: 'Streak Tracking', desc: 'See your current streak for each habit' },
            { name: 'Weekly View', desc: 'Check the entire week at once' },
          ]}
        />
        
        <ScreenCard
          icon={Link}
          title="Link Device"
          description="Sync tasks across multiple devices"
          features={[
            { name: 'Sync Code', desc: '12-character code to link devices' },
            { name: 'Real-time Sync', desc: 'Changes sync instantly across devices' },
            { name: 'Offline Support', desc: 'Works offline, syncs when back online' },
          ]}
        />
        
        <ScreenCard
          icon={PaintBrush}
          title="Appearance"
          description="Customize how FlowForge looks and feels"
          features={[
            { name: 'Theme Mode', desc: 'Switch between light, dark, or system theme' },
            { name: 'Color Customization', desc: 'Customize primary accent and colors' },
            { name: 'Background Image', desc: 'Set custom background image' },
            { name: 'Export/Import', desc: 'Download tasks as JSON, CSV, or Markdown' },
          ]}
          accent="text-app-primary"
        />
        
        <ShortcutCard
          shortcuts={[
            { key: 'n', action: 'New task (focus input)' },
            { key: 't', action: 'Go to Timer' },
            { key: 'd', action: 'Go to Dashboard' },
            { key: 's', action: 'Go to Settings' },
            { key: 'l', action: 'Go to Link Device' },
            { key: '/', action: 'Focus search' },
            { key: 'j', action: 'Select next task' },
            { key: 'k', action: 'Select previous task' },
            { key: 'e', action: 'Edit task' },
            { key: 'm', action: 'Toggle complete' },
            { key: '?', action: 'Show shortcuts' },
            { key: 'Esc', action: 'Close modal/clear' },
          ]}
        />
        
        <ScreenCard
          icon={LinkBreak}
          title="Webhooks & Integrations"
          description="Connect FlowForge with external services"
          features={[
            { name: 'Webhooks', desc: 'HTTP POST when task events occur' },
            { name: 'Google Calendar', desc: 'Sync tasks to your calendar' },
            { name: 'Google Tasks', desc: 'Import tasks from Google Tasks' },
            { name: 'Slack Notifications', desc: 'Get notified in Slack channels' },
          ]}
        />
      </div>

      <footer className="mt-12 pt-8 border-t border-app-border/30 text-center">
        <p className="text-sm text-app-muted mb-3">Press <kbd className="px-2 py-0.5 bg-app-surface border border-app-border/50 rounded text-xs font-mono">?</kbd> anytime to see keyboard shortcuts</p>
        <p className="text-xs text-app-muted/60">FlowForge v1.0 - Task Management Made Simple</p>
      </footer>
    </div>
  );
};