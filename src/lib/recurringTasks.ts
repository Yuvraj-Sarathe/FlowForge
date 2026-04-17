import { Task } from '../contexts/TaskContext';
import { isWorkingDay } from './workSchedule';

export const scheduleNotification = (task: Task) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const enabled = localStorage.getItem('flowforge_notifications_enabled') === 'true';
  if (!enabled) return;

  if (task.dueDate) {
    const dueTime = new Date(task.dueDate).getTime();
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;
    const timeUntilNotification = dueTime - now - fifteenMinutes;

    if (timeUntilNotification > 0 && timeUntilNotification < 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        new Notification('Task Due Soon', {
          body: `${task.title} is due in 15 minutes`,
          icon: '/icon-192.svg',
          tag: task.id,
        });
      }, timeUntilNotification);
    }
  }
};

export const scheduleRoutineNotification = (task: Task, time: string) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const enabled = localStorage.getItem('flowforge_notifications_enabled') === 'true';
  if (!enabled) return;

  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilNotification = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    const today = new Date();
    const shouldShow = 
      task.routineType === 'all' ||
      (task.routineType === 'working' && isWorkingDay(today)) ||
      (task.routineType === 'nonworking' && !isWorkingDay(today));

    if (shouldShow) {
      new Notification('Daily Routine', {
        body: task.title,
        icon: '/icon-192.svg',
        tag: task.id,
      });
    }

    // Reschedule for next day
    scheduleRoutineNotification(task, time);
  }, timeUntilNotification);
};

export const createRecurringTaskInstance = (task: Task): Task | null => {
  if (!task.recurring && !task.isRoutine) return null;

  const today = new Date();
  
  // Check if routine should appear today
  if (task.isRoutine) {
    const shouldShow = 
      task.routineType === 'all' ||
      (task.routineType === 'working' && isWorkingDay(today)) ||
      (task.routineType === 'nonworking' && !isWorkingDay(today));
    
    if (!shouldShow) return null;

    // Create today's instance with the routine time
    const [hours, minutes] = (task.dueDate ? new Date(task.dueDate).toTimeString().split(':') : ['09', '00']);
    const todayInstance = new Date();
    todayInstance.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return {
      ...task,
      id: `${task.id}-${today.toISOString().split('T')[0]}`,
      dueDate: todayInstance.toISOString(),
      status: 'todo',
      parentTaskId: task.id,
    };
  }

  // Handle recurring tasks
  if (task.recurring && task.recurrenceRule) {
    const dayOfWeek = today.getDay();
    let shouldCreate = false;

    switch (task.recurrenceRule) {
      case 'daily':
        shouldCreate = true;
        break;
      case 'weekly':
        shouldCreate = dayOfWeek === new Date(task.createdAt).getDay();
        break;
      case 'monthly':
        shouldCreate = today.getDate() === new Date(task.createdAt).getDate();
        break;
      case 'custom':
        shouldCreate = task.customRecurrenceDays?.includes(dayOfWeek) || false;
        break;
    }

    if (shouldCreate && task.dueDate) {
      const originalTime = new Date(task.dueDate);
      const newDueDate = new Date(today);
      newDueDate.setHours(originalTime.getHours(), originalTime.getMinutes(), 0, 0);

      return {
        ...task,
        id: `${task.id}-${today.toISOString().split('T')[0]}`,
        dueDate: newDueDate.toISOString(),
        status: 'todo',
        parentTaskId: task.id,
      };
    }
  }

  return null;
};
