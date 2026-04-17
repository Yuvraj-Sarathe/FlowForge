import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarBlank, Check } from '@phosphor-icons/react';
import { getWorkSchedule, saveWorkSchedule, toggleCustomNonWorkingDay, WorkScheduleSettings as WorkScheduleSettingsType } from '../lib/workSchedule';

export const WorkScheduleSettings: React.FC = () => {
  const [schedule, setSchedule] = useState<WorkScheduleSettingsType>(getWorkSchedule());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSaturdayToggle = () => {
    const newSchedule = { ...schedule, saturdayIsWorkday: !schedule.saturdayIsWorkday };
    setSchedule(newSchedule);
    saveWorkSchedule(newSchedule);
  };

  const handleDateToggle = (date: Date) => {
    toggleCustomNonWorkingDay(date);
    setSchedule(getWorkSchedule());
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
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

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-app-text mb-4 flex items-center gap-2">
          <CalendarBlank className="w-5 h-5" />
          Work Schedule
        </h3>
        <p className="text-sm text-app-muted mb-4">
          Configure your working days for routine tasks
        </p>
      </div>

      <div className="bg-app-surface border border-app-border rounded-xl p-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-medium text-app-text">Saturday is a working day</span>
          <button
            onClick={handleSaturdayToggle}
            className={`w-12 h-6 rounded-full transition-colors ${
              schedule.saturdayIsWorkday ? 'bg-app-primary' : 'bg-app-border'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                schedule.saturdayIsWorkday ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
        <p className="text-xs text-app-muted mt-2">
          Sunday is always a non-working day
        </p>
      </div>

      <div className="bg-app-surface border border-app-border rounded-xl p-4">
        <h4 className="text-sm font-medium text-app-text mb-3">Mark Custom Non-Working Days</h4>
        <p className="text-xs text-app-muted mb-4">
          Click on dates to mark them as holidays or non-working days
        </p>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-xs text-center text-app-muted font-medium py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays().map((day, idx) => {
            const isNonWorking = day && schedule.customNonWorkingDays.includes(day.toISOString().split('T')[0]);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => day && handleDateToggle(day)}
                disabled={!day}
                className={`p-2 text-sm rounded-lg relative ${
                  isNonWorking
                    ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                    : day
                    ? 'hover:bg-app-card text-app-text'
                    : 'invisible'
                }`}
              >
                {day?.getDate()}
                {isNonWorking && (
                  <div className="absolute top-0 right-0">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
