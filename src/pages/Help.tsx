'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Question, Plus, Clock, CalendarBlank, CheckCircle, Bell, Repeat, Tag, 
  SquaresFour, Gear, PaintBrush, Devices, Lightning, ArrowsClockwise
} from '@phosphor-icons/react';

function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string; weight?: string }>; title: string; children: React.ReactNode }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="bg-app-card border border-app-border/30 rounded-2xl p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-app-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-app-primary" weight="duotone" />
        </div>
        <h2 className="text-xl font-bold text-app-text">{title}</h2>
      </div>
      <div className="space-y-3 text-sm text-app-text leading-relaxed">
        {children}
      </div>
    </motion.section>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-app-surface/50 rounded-xl">
      <span className="w-6 h-6 rounded-full bg-app-primary text-app-primary-fg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {number}
      </span>
      <div>
        <h4 className="font-semibold text-app-text mb-1">{title}</h4>
        <p className="text-xs text-app-muted">{description}</p>
      </div>
    </div>
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
        <p>FlowForge helps you manage your daily tasks and routines. Here's what you can do:</p>
        <div className="space-y-2 mt-3">
          <Step 
            number="1" 
            title="Create Tasks" 
            description="One-time or recurring tasks with due dates and times"
          />
          <Step 
            number="2" 
            title="Create Routines" 
            description="Daily habits that repeat at the same time every day"
          />
          <Step 
            number="3" 
            title="Stay Organized" 
            description="Use tags, priorities, and different views to manage everything"
          />
        </div>
      </Section>

      <Section icon={Plus} title="Creating Tasks">
        <p><strong>What are Tasks?</strong></p>
        <p>Tasks are things you need to do once or on specific days. Examples: "Buy groceries", "Submit report by Friday", "Call dentist".</p>
        
        <p className="mt-3"><strong>How to Create a Task:</strong></p>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>Click the <strong>"New Task"</strong> button on the Dashboard</li>
          <li>Enter a title (required) - what you need to do</li>
          <li>Add a description (optional) - extra details</li>
          <li>Pick a due date and time (optional)</li>
          <li>Set priority: Low, Medium, or High</li>
          <li>Add tags to organize (like #work, #personal)</li>
          <li>Enable notifications if you want reminders</li>
          <li>Click "Create Task"</li>
        </ol>

        <p className="mt-3"><strong>Recurring Tasks:</strong></p>
        <p>Check "Recurring Task" if it repeats. Choose:</p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li><strong>Weekly</strong> - repeats every week</li>
          <li><strong>Monthly</strong> - repeats every month</li>
          <li><strong>Custom Days</strong> - pick specific days (Mon, Wed, Fri)</li>
        </ul>

        <p className="mt-3"><strong>Other Features:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li><strong>Subtasks</strong> - break big tasks into smaller steps</li>
          <li><strong>Attachments</strong> - upload files related to the task</li>
          <li><strong>Dependencies</strong> - link tasks that depend on others</li>
        </ul>
      </Section>

      <Section icon={Clock} title="Creating Routines">
        <p><strong>What are Routines?</strong></p>
        <p>Routines are daily habits that happen at the same time every day. Examples: "Morning workout at 7am", "Review emails at 9am", "Evening meditation at 8pm".</p>
        
        <p className="mt-3"><strong>How to Create a Routine:</strong></p>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>Click the <strong>"New Routine"</strong> button on the Dashboard</li>
          <li>Enter a title - your daily habit</li>
          <li>Pick a time using the clock picker</li>
          <li>Choose when it repeats:
            <ul className="list-disc list-inside ml-6 mt-1">
              <li><strong>All days</strong> - every single day</li>
              <li><strong>Working days only</strong> - Monday to Friday (or your work schedule)</li>
              <li><strong>Non-working days only</strong> - weekends and holidays</li>
            </ul>
          </li>
          <li>Set priority and add tags</li>
          <li>Enable notifications for daily reminders</li>
          <li>Click "Create Routine"</li>
        </ol>

        <p className="mt-3"><strong>Routines vs Tasks:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Routines have NO due date - they repeat daily at the same time</li>
          <li>Tasks have specific due dates and can be one-time or recurring</li>
          <li>Routines appear in the calendar with a 🔄 icon</li>
        </ul>
      </Section>

      <Section icon={CalendarBlank} title="Calendar View">
        <p><strong>What you'll see:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>All your tasks with due dates</li>
          <li>All your daily routines (shown with 🔄)</li>
          <li>Color coding: routines are purple, high priority tasks are red</li>
        </ul>

        <p className="mt-3"><strong>How to use it:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Switch between Month, Week, and Day views</li>
          <li>Click any date to see tasks for that day</li>
          <li>Click a task to view details or edit</li>
          <li>Use arrows to navigate between months/weeks/days</li>
        </ul>
      </Section>

      <Section icon={SquaresFour} title="Kanban Board">
        <p><strong>What it is:</strong></p>
        <p>A visual board with three columns: To Do, In Progress, and Done.</p>

        <p className="mt-3"><strong>How to use it:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Drag tasks between columns to change their status</li>
          <li>Click the checkmark to quickly mark tasks as done</li>
          <li>Great for seeing all your work at a glance</li>
        </ul>
      </Section>

      <Section icon={Clock} title="Focus Timer (Pomodoro)">
        <p><strong>What it is:</strong></p>
        <p>A timer to help you focus on work in short bursts with breaks.</p>

        <p className="mt-3"><strong>How it works:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li><strong>Work session:</strong> 25 minutes of focused work</li>
          <li><strong>Short break:</strong> 5 minutes to rest</li>
          <li><strong>Long break:</strong> 15 minutes after 4 work sessions</li>
        </ul>

        <p className="mt-3"><strong>How to use it:</strong></p>
        <ol className="list-decimal list-inside ml-2 space-y-1">
          <li>Go to the Focus page</li>
          <li>Click "Start" to begin a work session</li>
          <li>Work until the timer rings</li>
          <li>Take your break when prompted</li>
          <li>Repeat!</li>
        </ol>
      </Section>

      <Section icon={Bell} title="Notifications">
        <p><strong>How to enable:</strong></p>
        <ol className="list-decimal list-inside ml-2 space-y-1">
          <li>Go to Settings → Notifications</li>
          <li>Toggle "Enable Browser Notifications"</li>
          <li>Allow notifications when your browser asks</li>
        </ol>

        <p className="mt-3"><strong>When you'll get notified:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>15 minutes before a task is due</li>
          <li>When a routine time arrives</li>
          <li>Only for tasks/routines where you enabled notifications</li>
        </ul>
      </Section>

      <Section icon={Gear} title="Work Schedule">
        <p><strong>What it is:</strong></p>
        <p>Tell FlowForge which days you work so routines can follow your schedule.</p>

        <p className="mt-3"><strong>How to set it up:</strong></p>
        <ol className="list-decimal list-inside ml-2 space-y-1">
          <li>Go to Settings → Work Schedule</li>
          <li>Toggle if Saturday is a working day for you</li>
          <li>Click dates on the calendar to mark holidays/non-working days</li>
          <li>Your "working days only" routines will respect this schedule</li>
        </ol>
      </Section>

      <Section icon={Tag} title="Tags and Filters">
        <p><strong>Using Tags:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Add tags when creating tasks (like #work, #urgent, #personal)</li>
          <li>Use the filter dropdown on Dashboard to show only specific tags</li>
          <li>Great for organizing tasks by project or category</li>
        </ul>

        <p className="mt-3"><strong>Other Filters:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li><strong>Search:</strong> Type keywords to find tasks</li>
          <li><strong>Sort:</strong> By newest, due date, or priority</li>
          <li><strong>Bulk Actions:</strong> Click "Bulk" to select multiple tasks</li>
        </ul>
      </Section>

      <Section icon={Devices} title="Sync Across Devices">
        <p><strong>How to sync:</strong></p>
        <ol className="list-decimal list-inside ml-2 space-y-1">
          <li>Sign in with Google on all your devices</li>
          <li>Your tasks automatically sync in real-time</li>
          <li>Works offline - syncs when you're back online</li>
        </ol>

        <p className="mt-3"><strong>Google Calendar Sync:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Click "Sync Calendar" on Dashboard</li>
          <li>Imports events from Google Calendar as tasks</li>
          <li>Exports your tasks to Google Calendar</li>
          <li>Two-way sync keeps everything in sync</li>
        </ul>
      </Section>

      <Section icon={PaintBrush} title="Customization">
        <p><strong>Theme:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Go to Settings → Appearance</li>
          <li>Choose Light, Dark, or System (follows your device)</li>
        </ul>

        <p className="mt-3"><strong>Export Your Data:</strong></p>
        <ul className="list-disc list-inside ml-2 space-y-1">
          <li>Settings → Export/Import</li>
          <li>Download as JSON, CSV, or Markdown</li>
          <li>Keep a backup or move to another app</li>
        </ul>
      </Section>

      <Section icon={ArrowsClockwise} title="Quick Tips">
        <ul className="list-disc list-inside ml-2 space-y-2">
          <li><strong>Start simple:</strong> Create a few tasks and routines to get comfortable</li>
          <li><strong>Use priorities:</strong> Mark important tasks as High priority</li>
          <li><strong>Check daily:</strong> Review your calendar each morning</li>
          <li><strong>Complete tasks:</strong> Click the checkbox to mark tasks done</li>
          <li><strong>Try the timer:</strong> Use Focus mode when you need to concentrate</li>
          <li><strong>Enable notifications:</strong> Never miss important tasks</li>
          <li><strong>Organize with tags:</strong> Keep work and personal tasks separate</li>
        </ul>
      </Section>

      <footer className="mt-12 pt-8 border-t border-app-border/30 text-center">
        <p className="text-sm text-app-muted mb-2">Need more help?</p>
        <p className="text-xs text-app-muted/60">FlowForge is designed to be simple and intuitive. Just start using it and you'll get the hang of it!</p>
      </footer>
    </div>
  );
};
