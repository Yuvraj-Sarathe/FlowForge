import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarBlank, Tag, Flag, Repeat, Link, ListChecks, Plus, Clock } from '@phosphor-icons/react';
import { useTasks } from '../contexts/TaskContext';
import { sanitizeTitle, sanitizeTags } from '../lib/sanitize';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isRoutine, setIsRoutine] = useState(false);
  const [routineType, setRoutineType] = useState<'all' | 'working' | 'nonworking'>('all');
  const [recurring, setRecurring] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [dependentTask, setDependentTask] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let dueDate: string | undefined;
    if (selectedDate) {
      const [hours, minutes] = selectedTime.split(':');
      const dateTime = new Date(selectedDate);
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      dueDate = dateTime.toISOString();
    }

    await addTask({
      title: sanitizeTitle(title),
      description: description.trim() || undefined,
      priority,
      status: 'todo',
      tags: sanitizeTags(tags),
      dueDate,
      isRoutine,
      routineType: isRoutine ? routineType : undefined,
      recurring,
      recurrenceRule: recurring ? recurrenceRule : undefined,
      customRecurrenceDays: recurrenceRule === 'custom' ? customDays : undefined,
      subtasks: subtasks.map((text, index) => ({
        id: crypto.randomUUID(),
        text,
        completed: false,
        order: index,
      })),
      dependsOn: dependentTask.trim() || undefined,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedDate(null);
    setSelectedTime('09:00');
    setPriority('medium');
    setTags([]);
    setTagInput('');
    setIsRoutine(false);
    setRoutineType('all');
    setRecurring(false);
    setRecurrenceRule('daily');
    setCustomDays([]);
    setSubtasks([]);
    setSubtaskInput('');
    setDependentTask('');
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks([...subtasks, subtaskInput.trim()]);
      setSubtaskInput('');
    }
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const toggleCustomDay = (day: number) => {
    setCustomDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const generateCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCalendarMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-app-card border border-app-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-app-card border-b border-app-border px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-app-text">Create New Task</h2>
            <button onClick={onClose} className="text-app-muted hover:text-app-text transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-app-text mb-2">Task Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-3 text-app-text focus:border-app-primary outline-none"
                autoFocus
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-app-text mb-2">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
                className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-3 text-app-text focus:border-app-primary outline-none resize-none"
              />
            </div>

            {/* Date & Time Picker */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-app-text mb-2 flex items-center gap-2">
                  <CalendarBlank className="w-4 h-4" />
                  Due Date
                </label>
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-3 text-app-text text-left hover:border-app-primary transition-colors"
                >
                  {selectedDate ? selectedDate.toLocaleDateString() : 'Select date'}
                </button>
                {showCalendar && (
                  <div className="absolute mt-2 bg-app-card border border-app-border rounded-xl p-4 shadow-xl z-20 w-80">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => navigateMonth('prev')}
                        className="p-2 hover:bg-app-surface rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-app-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h3 className="text-sm font-semibold text-app-text">
                        {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <button
                        type="button"
                        onClick={() => navigateMonth('next')}
                        className="p-2 hover:bg-app-surface rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-app-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map(day => (
                        <div key={day} className="text-xs text-center text-app-muted font-medium">{day}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendarDays().map((day, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (day) {
                              setSelectedDate(day);
                              setShowCalendar(false);
                            }
                          }}
                          disabled={!day}
                          className={`p-2 text-sm rounded-lg ${
                            day && selectedDate && day.toDateString() === selectedDate.toDateString()
                              ? 'bg-app-primary text-app-primary-fg'
                              : day
                              ? 'hover:bg-app-surface text-app-text'
                              : 'invisible'
                          }`}
                        >
                          {day?.getDate()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-app-text mb-2">Time</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={e => setSelectedTime(e.target.value)}
                  className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-3 text-app-text focus:border-app-primary outline-none"
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-app-text mb-2 flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-3 text-app-text focus:border-app-primary outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-app-text mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                  className="flex-1 bg-app-surface border border-app-border rounded-xl px-4 py-2 text-app-text focus:border-app-primary outline-none"
                />
                <button type="button" onClick={addTag} className="px-4 py-2 bg-app-primary text-app-primary-fg rounded-xl">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-app-surface text-app-text rounded-lg text-sm flex items-center gap-2">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-app-muted hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Task Type */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRoutine}
                  onChange={e => setIsRoutine(e.target.checked)}
                  className="w-5 h-5 rounded border-app-border text-app-primary focus:ring-app-primary"
                />
                <span className="text-sm font-medium text-app-text flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Daily Routine (not a one-time task)
                </span>
              </label>
              {isRoutine && (
                <div className="mt-3 ml-8 space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={routineType === 'all'} onChange={() => setRoutineType('all')} className="text-app-primary" />
                    <span className="text-sm text-app-text">All days</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={routineType === 'working'} onChange={() => setRoutineType('working')} className="text-app-primary" />
                    <span className="text-sm text-app-text">Working days only</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={routineType === 'nonworking'} onChange={() => setRoutineType('nonworking')} className="text-app-primary" />
                    <span className="text-sm text-app-text">Non-working days only</span>
                  </label>
                </div>
              )}
            </div>

            {/* Recurring */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recurring}
                  onChange={e => setRecurring(e.target.checked)}
                  className="w-5 h-5 rounded border-app-border text-app-primary focus:ring-app-primary"
                />
                <span className="text-sm font-medium text-app-text flex items-center gap-2">
                  <Repeat className="w-4 h-4" />
                  Recurring Task
                </span>
              </label>
              {recurring && (
                <div className="mt-2 space-y-3">
                  <select
                    value={recurrenceRule}
                    onChange={e => setRecurrenceRule(e.target.value as any)}
                    className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2 text-app-text focus:border-app-primary outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom Days</option>
                  </select>
                  {recurrenceRule === 'custom' && (
                    <div className="flex gap-2">
                      {dayNames.map((day, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleCustomDay(idx)}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                            customDays.includes(idx)
                              ? 'bg-app-primary text-app-primary-fg'
                              : 'bg-app-surface text-app-muted hover:text-app-text'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Subtasks */}
            <div>
              <label className="block text-sm font-medium text-app-text mb-2 flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                Subtasks
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={subtaskInput}
                  onChange={e => setSubtaskInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                  placeholder="Add subtask..."
                  className="flex-1 bg-app-surface border border-app-border rounded-xl px-4 py-2 text-app-text focus:border-app-primary outline-none"
                />
                <button type="button" onClick={addSubtask} className="px-4 py-2 bg-app-primary text-app-primary-fg rounded-xl">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-2 bg-app-surface rounded-lg">
                    <span className="flex-1 text-sm text-app-text">{subtask}</span>
                    <button type="button" onClick={() => removeSubtask(index)} className="text-app-muted hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dependent Task */}
            <div>
              <label className="block text-sm font-medium text-app-text mb-2 flex items-center gap-2">
                <Link className="w-4 h-4" />
                Dependent Task ID (Optional)
              </label>
              <input
                type="text"
                value={dependentTask}
                onChange={e => setDependentTask(e.target.value)}
                placeholder="Task ID this depends on..."
                className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2 text-app-text focus:border-app-primary outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-app-surface text-app-text rounded-xl font-medium hover:bg-app-border transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="flex-1 px-4 py-3 bg-app-primary text-app-primary-fg rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Create Task
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
