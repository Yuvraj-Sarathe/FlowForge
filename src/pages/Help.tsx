'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Question, Plus, Clock, CalendarBlank, CheckCircle, Bell, Repeat, Tag, 
  SquaresFour, Gear, PaintBrush, Devices, Lightning, ArrowsClockwise,
  Play, Calendar, ListChecks, Timer, Palette, Download, GoogleLogo
} from '@phosphor-icons/react';

interface SectionProps {
  icon: React.ComponentType<{ className?: string; weight?: string }>;
  title: string;
  children: React.ReactNode;
}

function Section({ icon: Icon, title, children }: SectionProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-app-card border border-app-border/30 rounded-2xl p-6 mb-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-app-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-app-primary" weight="duotone" />
        </div>
        <h2 className="text-xl font-bold text-app-text">{title}</h2>
      </div>
      <div className="text-sm text-app-text leading-relaxed">
        {children}
      </div>
    </motion.section>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string; weight?: string }>; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-app-surface/50 rounded-xl">
      <div className="w-8 h-8 rounded-lg bg-app-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-app-primary" weight="duotone" />
      </div>
      <div>
        <h4 className="font-semibold text-app-text text-sm">{title}</h4>
        <p className="text-xs text-app-muted leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function QuickStep({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-6 h-6 rounded-full bg-app-primary/20 text-app-primary text-xs font-bold flex items-center justify-center shrink-0">
        {number}
      </span>
      <span className="text-sm text-app-text">{title}</span>
    </div>
  );
}

function QuickTip({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-sm text-app-text flex items-start gap-2">
      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" weight="fill" />
      <span>{children}</span>
    </li>
  );
}

export const Help: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-[100dvh]">
      <header className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-4xl md:text-5xl font-bold tracking-tight text-app-text mb-3 flex items-center gap-3"
        >
          <Question className="w-10 h-10 text-app-primary" weight="duotone" />
          FlowForge Help Center
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.1 }} 
          className="text-lg text-app-muted"
        >
          Your guide to mastering productivity with FlowForge
        </motion.p>
      </header>

      {/* Table of Contents */}
      <Section icon={ListChecks} title="Table of Contents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-app-text mb-2">Getting Started</h4>
            <ul className="text-sm text-app-muted space-y-1">
              <li>• <a href="#overview" className="hover:text-app-primary">Overview</a></li>
              <li>• <a href="#quick-start" className="hover:text-app-primary">Quick Start</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-app-text mb-2">Features</h4>
            <ul className="text-sm text-app-muted space-y-1">
              <li>• <a href="#tasks" className="hover:text-app-primary">Tasks</a></li>
              <li>• <a href="#routines" className="hover:text-app-primary">Routines</a></li>
              <li>• <a href="#views" className="hover:text-app-primary">Views</a></li>
              <li>• <a href="#timer" className="hover:text-app-primary">Focus Timer</a></li>
              <li>• <a href="#organization" className="hover:text-app-primary">Organization</a></li>
              <li>• <a href="#sync" className="hover:text-app-primary">Sync & Backup</a></li>
              <li>• <a href="#settings" className="hover:text-app-primary">Settings</a></li>
            </ul>
          </div>
        </div>
      </Section>

      <Section icon={Lightning} title="Overview" id="overview">
        <p className="mb-4">FlowForge is your personal productivity companion designed to help you manage tasks, build habits, and stay focused. Whether you're planning your day or tracking long-term goals, FlowForge adapts to your workflow.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FeatureCard icon={ListChecks} title="Task Management" description="Create, organize, and track tasks with due dates, priorities, and subtasks" />
          <FeatureCard icon={Repeat} title="Habit Building" description="Establish daily routines and habits with smart scheduling" />
          <FeatureCard icon={Calendar} title="Multiple Views" description="See your tasks in calendar, kanban, or list format" />
          <FeatureCard icon={Timer} title="Focus Sessions" description="Use the Pomodoro timer to maintain concentration" />
        </div>
      </Section>

      <Section icon={Play} title="Quick Start" id="quick-start">
        <p className="mb-4">Get up and running in minutes:</p>
        <div className="space-y-3">
          <QuickStep number="1" title="Sign in or link your device" />
          <QuickStep number="2" title="Create your first task or routine" />
          <QuickStep number="3" title="Explore different views (Calendar, Kanban)" />
          <QuickStep number="4" title="Set up notifications and work schedule" />
        </div>
        <p className="mt-4 text-sm text-app-muted">Pro tip: Start with 3-5 tasks to avoid overwhelm. You can always add more later!</p>
      </Section>

      <Section icon={Plus} title="Tasks" id="tasks">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-app-text mb-2">What are Tasks?</h3>
            <p className="text-sm text-app-muted mb-4">Tasks are one-time or recurring items you need to complete. They can have due dates, priorities, and more.</p>
            
            <h3 className="font-semibold text-app-text mb-3">Creating Tasks</h3>
            <div className="space-y-2">
              <QuickStep number="1" title="Click 'New Task' or use Quick Add" />
              <QuickStep number="2" title="Enter title and description" />
              <QuickStep number="3" title="Set due date, time, and priority" />
              <QuickStep number="4" title="Add tags and subtasks if needed" />
              <QuickStep number="5" title="Save your task" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-app-surface/50 rounded-xl p-4">
              <h4 className="font-semibold text-app-text mb-2">Task Features</h4>
              <div className="space-y-2 text-sm text-app-muted">
                <p>• <strong>Subtasks</strong> - Break down complex tasks</p>
                <p>• <strong>Attachments</strong> - Upload files and images</p>
                <p>• <strong>Dependencies</strong> - Link tasks together</p>
                <p>• <strong>Recurring</strong> - Set up repeating tasks</p>
                <p>• <strong>Priority levels</strong> - High, Medium, Low</p>
              </div>
            </div>
            <div className="bg-app-surface/50 rounded-xl p-4">
              <h4 className="font-semibold text-app-text mb-2">Quick Actions</h4>
              <div className="space-y-2 text-sm text-app-muted">
                <p>• Click checkbox to mark complete</p>
                <p>• Drag to reorder in lists</p>
                <p>• Use keyboard shortcuts (Ctrl+Enter to save)</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={Clock} title="Routines" id="routines">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-app-text mb-2">What are Routines?</h3>
            <p className="text-sm text-app-muted mb-4">Routines are daily habits that repeat at specific times. Perfect for building consistent habits.</p>
            
            <h3 className="font-semibold text-app-text mb-3">Creating Routines</h3>
            <div className="space-y-2">
              <QuickStep number="1" title="Click 'New Routine'" />
              <QuickStep number="2" title="Enter name and description" />
              <QuickStep number="3" title="Set time and repeat schedule" />
              <QuickStep number="4" title="Choose days of the week" />
              <QuickStep number="5" title="Save your routine" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-app-surface/50 rounded-xl p-4">
              <h4 className="font-semibold text-app-text mb-2">Repeat Options</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-purple-500/10 text-purple-500 rounded-lg text-xs font-medium">Every Day</span>
                <span className="px-3 py-1.5 bg-purple-500/10 text-purple-500 rounded-lg text-xs font-medium">Weekdays</span>
                <span className="px-3 py-1.5 bg-purple-500/10 text-purple-500 rounded-lg text-xs font-medium">Weekends</span>
                <span className="px-3 py-1.5 bg-purple-500/10 text-purple-500 rounded-lg text-xs font-medium">Custom Days</span>
              </div>
            </div>
            <div className="bg-app-surface/50 rounded-xl p-4">
              <h4 className="font-semibold text-app-text mb-2">Tips for Success</h4>
              <div className="space-y-2 text-sm text-app-muted">
                <p>• Start with 2-3 routines</p>
                <p>• Set realistic times</p>
                <p>• Use notifications to stay on track</p>
                <p>• Review and adjust weekly</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={SquaresFour} title="Views" id="views">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-app-text mb-2">Calendar View</h4>
            <p className="text-sm text-app-muted mb-2">See all your tasks and routines in a calendar format.</p>
            <ul className="text-sm text-app-muted space-y-1">
              <li>• Switch between Month, Week, Day</li>
              <li>• Color-coded: Purple = routines, Red = high priority</li>
              <li>• Click dates to see details</li>
              <li>• Drag tasks to reschedule</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-app-text mb-2">Kanban Board</h4>
            <p className="text-sm text-app-muted mb-2">Visualize your workflow with columns.</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 bg-app-surface/50 rounded-lg p-2 text-center">
                <span className="text-xs font-medium text-app-muted">To Do</span>
              </div>
              <div className="flex-1 bg-blue-500/20 rounded-lg p-2 text-center">
                <span className="text-xs font-medium text-blue-500">In Progress</span>
              </div>
              <div className="flex-1 bg-green-500/20 rounded-lg p-2 text-center">
                <span className="text-xs font-medium text-green-500">Done</span>
              </div>
            </div>
            <ul className="text-sm text-app-muted space-y-1">
              <li>• Drag tasks between columns</li>
              <li>• See progress at a glance</li>
              <li>• Great for project management</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section icon={Timer} title="Focus Timer" id="timer">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-app-text mb-3">Pomodoro Technique</h4>
            <div className="flex items-center gap-3 mb-4">
              <Timer className="w-8 h-8 text-red-500" weight="duotone" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-app-text">Work</span>
                  <span className="text-app-muted">25 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-app-text">Short Break</span>
                  <span className="text-app-muted">5 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-app-text">Long Break</span>
                  <span className="text-app-muted">15 min</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-app-text mb-2">How to Use</h4>
            <div className="space-y-2">
              <QuickStep number="1" title="Go to Timer page" />
              <QuickStep number="2" title="Choose session type" />
              <QuickStep number="3" title="Click Start to begin" />
              <QuickStep number="4" title="Take breaks as scheduled" />
            </div>
            <p className="mt-4 text-sm text-app-muted">Customize timer durations in Settings.</p>
          </div>
        </div>
      </Section>

      <Section icon={Tag} title="Organization" id="organization">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-app-text mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs">#work</span>
              <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">#personal</span>
              <span className="px-2 py-1 bg-orange-500/10 text-orange-500 rounded text-xs">#urgent</span>
            </div>
            <p className="text-sm text-app-muted">Add tags when creating tasks. Filter and search by tags.</p>
          </div>
          <div>
            <h4 className="font-semibold text-app-text mb-2">Filters & Search</h4>
            <ul className="text-sm text-app-muted space-y-1">
              <li>• Search by keywords</li>
              <li>• Filter by priority, status, tags</li>
              <li>• Sort by date, priority, or name</li>
              <li>• Bulk select and edit tasks</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section icon={Devices} title="Sync & Backup" id="sync">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-app-text mb-2 flex items-center gap-2">
              <GoogleLogo className="w-4 h-4" />
              Google Sync
            </h4>
            <p className="text-sm text-app-muted mb-2">Keep your data synced across devices.</p>
            <ol className="text-sm text-app-muted space-y-1 ml-4 list-decimal">
              <li>Sign in with Google</li>
              <li>Auto-syncs in real-time</li>
              <li>Works offline</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-app-text mb-2">Device Linking</h4>
            <p className="text-sm text-app-muted mb-2">Connect multiple devices seamlessly.</p>
            <ol className="text-sm text-app-muted space-y-1 ml-4 list-decimal">
              <li>Go to Link Device page</li>
              <li>Scan QR code or enter code</li>
              <li>Instant sync across devices</li>
            </ol>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold text-app-text mb-2">Export & Import</h4>
          <p className="text-sm text-app-muted">Backup your data or migrate to another service.</p>
          <ul className="text-sm text-app-muted space-y-1 ml-4">
            <li>• Export to JSON, CSV, or Markdown</li>
            <li>• Import from other task managers</li>
            <li>• Available in Settings</li>
          </ul>
        </div>
      </Section>

      <Section icon={Gear} title="Settings" id="settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-app-text mb-2">Notifications</h4>
            <ul className="text-sm text-app-muted space-y-1">
              <li>• Enable browser notifications</li>
              <li>• Get reminded 15 min before due</li>
              <li>• Routine time alerts</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-app-text mb-2">Work Schedule</h4>
            <ul className="text-sm text-app-muted space-y-1">
              <li>• Set your working days</li>
              <li>• Mark holidays</li>
              <li>• Affects routine scheduling</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold text-app-text mb-2">Appearance</h4>
          <p className="text-sm text-app-muted">Choose light, dark, or system theme.</p>
        </div>
      </Section>

      <Section icon={CheckCircle} title="Tips & Tricks">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickTip>Use the Quick Add button for fast task creation</QuickTip>
          <QuickTip>Set priorities to focus on what matters most</QuickTip>
          <QuickTip>Review your calendar every morning</QuickTip>
          <QuickTip>Click checkbox to mark complete</QuickTip>
          <QuickTip>Use the Pomodoro timer to maintain focus</QuickTip>
          <QuickTip>Enable notifications but don't overdo it</QuickTip>
          <QuickTip>Start routines small and build up</QuickTip>
          <QuickTip>Export data regularly for backup</QuickTip>
        </div>
      </Section>

      <footer className="mt-8 pt-6 border-t border-app-border/30 text-center">
        <p className="text-sm text-app-muted mb-2">Still need help?</p>
        <p className="text-xs text-app-muted/60">FlowForge is designed to be intuitive. Explore and experiment!</p>
      </footer>
    </div>
  );
};