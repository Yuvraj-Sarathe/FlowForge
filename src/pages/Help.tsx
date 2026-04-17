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
          How to Use FlowForge
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.1 }} 
          className="text-lg text-app-muted"
        >
          Everything you need to know to get started
        </motion.p>
      </header>

      <Section icon={Lightning} title="Getting Started">
        <p className="mb-4">FlowForge helps you manage your daily tasks and routines. Here's what you can do:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FeatureCard icon={ListChecks} title="Create Tasks" description="One-time or recurring with due dates and times" />
          <FeatureCard icon={Repeat} title="Create Routines" description="Daily habits that repeat at the same time" />
          <FeatureCard icon={Tag} title="Stay Organized" description="Use tags, priorities, and different views" />
        </div>
      </Section>

      <Section icon={Plus} title="Creating Tasks">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-app-text mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold">?</span>
              What are Tasks?
            </h3>
            <p className="text-sm text-app-muted mb-4">Things you need to do once or on specific days.</p>
            
            <h3 className="font-semibold text-app-text mb-3">How to Create:</h3>
            <div className="space-y-2">
              <QuickStep number="1" title='Click "New Task" on Dashboard' />
              <QuickStep number="2" title="Enter a title (required)" />
              <QuickStep number="3" title="Add a description (optional)" />
              <QuickStep number="4" title="Pick a due date & time" />
              <QuickStep number="5" title="Set priority (Low/Medium/High)" />
              <QuickStep number="6" title="Click Create Task" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-app-surface/50 rounded-xl p-4">
              <h4 className="font-semibold text-app-text mb-2">Recurring Options</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-app-primary/10 text-app-primary rounded-lg text-xs font-medium">Weekly</span>
                <span className="px-3 py-1.5 bg-app-primary/10 text-app-primary rounded-lg text-xs font-medium">Monthly</span>
                <span className="px-3 py-1.5 bg-app-primary/10 text-app-primary rounded-lg text-xs font-medium">Custom Days</span>
              </div>
            </div>
            <div className="bg-app-surface/50 rounded-xl p-4">
              <h4 className="font-semibold text-app-text mb-2">Other Features</h4>
              <div className="space-y-2 text-sm text-app-muted">
                <p>• <strong>Subtasks</strong> - break big tasks into steps</p>
                <p>• <strong>Attachments</strong> - upload related files</p>
                <p>• <strong>Dependencies</strong> - link tasks together</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={Clock} title="Creating Routines">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-app-text mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-purple-500/20 text-purple-500 flex items-center justify-center text-xs font-bold">?</span>
              What are Routines?
            </h3>
            <p className="text-sm text-app-muted mb-4">Daily habits that happen at the same time every day.</p>
            
            <h3 className="font-semibold text-app-text mb-3">How to Create:</h3>
            <div className="space-y-2">
              <QuickStep number="1" title='Click "New Routine"' />
              <QuickStep number="2" title="Enter a title" />
              <QuickStep number="3" title="Pick a time" />
              <QuickStep number="4" title="Choose repeat days" />
              <QuickStep number="5" title="Click Create" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-app-surface/50 rounded-xl p-4">
              <h4 className="font-semibold text-app-text mb-2">Repeat Options</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-purple-500/10 text-purple-500 rounded-lg text-xs font-medium">All Days</span>
                <span className="px-3 py-1.5 bg-purple-500/10 text-purple-500 rounded-lg text-xs font-medium">Working Days</span>
                <span className="px-3 py-1.5 bg-purple-500/10 text-purple-500 rounded-lg text-xs font-medium">Weekends</span>
              </div>
            </div>
            <div className="bg-app-surface/50 rounded-xl p-4">
              <h4 className="font-semibold text-app-text mb-2">Routines vs Tasks</h4>
              <div className="space-y-2 text-sm text-app-muted">
                <p><strong>Routines</strong> → No due date, repeat daily</p>
                <p><strong>Tasks</strong> → Have due dates, one-time</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Section icon={CalendarBlank} title="Calendar View">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-app-text mb-2">What you'll see</h4>
              <ul className="text-sm text-app-muted space-y-1">
                <li>• All tasks with due dates</li>
                <li>• Daily routines (with 🔄 icon)</li>
                <li>• Color coding: purple = routines, red = high priority</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-app-text mb-2">How to use</h4>
              <ul className="text-sm text-app-muted space-y-1">
                <li>• Switch Month / Week / Day views</li>
                <li>• Click dates to see tasks</li>
                <li>• Click tasks to view/edit</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section icon={SquaresFour} title="Kanban Board">
          <div className="space-y-4">
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
            <div>
              <h4 className="font-semibold text-app-text mb-2">How to use</h4>
              <ul className="text-sm text-app-muted space-y-1">
                <li>• Drag tasks between columns</li>
                <li>• Click checkmark to mark done</li>
                <li>• See all work at a glance</li>
              </ul>
            </div>
          </div>
        </Section>
      </div>

      <Section icon={Timer} title="Focus Timer">
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
            <h4 className="font-semibold text-app-text mb-2">How to use</h4>
            <div className="space-y-2">
              <QuickStep number="1" title="Go to Focus page" />
              <QuickStep number="2" title="Click Start" />
              <QuickStep number="3" title="Work until timer rings" />
              <QuickStep number="4" title="Take your break" />
            </div>
          </div>
        </div>
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Section icon={Bell} title="Notifications">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-app-text mb-2">Enable</h4>
              <ol className="text-sm text-app-muted space-y-1 ml-4 list-decimal">
                <li>Settings → Notifications</li>
                <li>Toggle Enable Notifications</li>
                <li>Allow in browser popup</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-app-text mb-2">You'll get notified</h4>
              <ul className="text-sm text-app-muted space-y-1">
                <li>• 15 min before task due</li>
                <li>• When routine time arrives</li>
                <li>• Only if notifications enabled</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section icon={Gear} title="Work Schedule">
          <div className="space-y-4">
            <p className="text-sm text-app-muted">Tell FlowForge which days you work so routines match your schedule.</p>
            <div>
              <h4 className="font-semibold text-app-text mb-2">Set up</h4>
              <ol className="text-sm text-app-muted space-y-1 ml-4 list-decimal">
                <li>Settings → Work Schedule</li>
                <li>Toggle Saturday as work day</li>
                <li>Click dates for holidays</li>
              </ol>
            </div>
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Section icon={Tag} title="Tags & Filters">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-app-text mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs">#work</span>
                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">#personal</span>
                <span className="px-2 py-1 bg-orange-500/10 text-orange-500 rounded text-xs">#urgent</span>
              </div>
              <p className="text-sm text-app-muted">Add tags when creating tasks. Filter by them on Dashboard.</p>
            </div>
            <div>
              <h4 className="font-semibold text-app-text mb-2">Other Filters</h4>
              <ul className="text-sm text-app-muted space-y-1">
                <li>• Search keywords</li>
                <li>• Sort by date/priority</li>
                <li>• Bulk select tasks</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section icon={Devices} title="Sync">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-app-text mb-2 flex items-center gap-2">
                <GoogleLogo className="w-4 h-4" />
                Google Sync
              </h4>
              <ol className="text-sm text-app-muted space-y-1 ml-4 list-decimal">
                <li>Sign in with Google</li>
                <li>Auto-syncs across devices</li>
                <li>Works offline too</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-app-text mb-2">Calendar Sync</h4>
              <ul className="text-sm text-app-muted space-y-1">
                <li>• Click "Sync Calendar"</li>
                <li>• Import Google Calendar</li>
                <li>• Two-way sync</li>
              </ul>
            </div>
          </div>
        </Section>
      </div>

      <Section icon={PaintBrush} title="Customization">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 bg-app-surface/50 rounded-xl p-4">
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <Palette className="w-5 h-5 text-gray-400" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-app-text text-sm">Theme</h4>
              <p className="text-xs text-app-muted">Settings → Appearance</p>
              <p className="text-xs text-app-muted">Light / Dark / System</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-app-surface/50 rounded-xl p-4">
            <Download className="w-10 h-10 text-app-primary" weight="duotone" />
            <div>
              <h4 className="font-semibold text-app-text text-sm">Export Data</h4>
              <p className="text-xs text-app-muted">Settings → Export/Import</p>
              <p className="text-xs text-app-muted">JSON / CSV / Markdown</p>
            </div>
          </div>
        </div>
      </Section>

      <Section icon={ArrowsClockwise} title="Quick Tips">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickTip>Start simple with a few tasks</QuickTip>
          <QuickTip>Use priorities for important tasks</QuickTip>
          <QuickTip>Review your calendar daily</QuickTip>
          <QuickTip>Click checkbox to mark done</QuickTip>
          <QuickTip>Try Focus mode to concentrate</QuickTip>
          <QuickTip>Enable notifications to stay on track</QuickTip>
          <QuickTip>Organize with tags</QuickTip>
          <QuickTip>Create routines for habits</QuickTip>
        </div>
      </Section>

      <footer className="mt-8 pt-6 border-t border-app-border/30 text-center">
        <p className="text-sm text-app-muted mb-2">Need more help?</p>
        <p className="text-xs text-app-muted/60">FlowForge is designed to be simple. Just start using it!</p>
      </footer>
    </div>
  );
};