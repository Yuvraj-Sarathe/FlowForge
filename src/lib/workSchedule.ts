export interface WorkScheduleSettings {
  saturdayIsWorkday: boolean;
  customNonWorkingDays: string[]; // ISO date strings
}

const STORAGE_KEY = 'flowforge_work_schedule';

export const getWorkSchedule = (): WorkScheduleSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { saturdayIsWorkday: false, customNonWorkingDays: [] };
  } catch {
    return { saturdayIsWorkday: false, customNonWorkingDays: [] };
  }
};

export const saveWorkSchedule = (settings: WorkScheduleSettings): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

export const isWorkingDay = (date: Date): boolean => {
  const schedule = getWorkSchedule();
  const dateStr = date.toISOString().split('T')[0];
  
  if (schedule.customNonWorkingDays.includes(dateStr)) {
    return false;
  }
  
  const day = date.getDay();
  if (day === 0) return false; // Sunday
  if (day === 6) return schedule.saturdayIsWorkday;
  
  return true;
};

export const toggleCustomNonWorkingDay = (date: Date): void => {
  const schedule = getWorkSchedule();
  const dateStr = date.toISOString().split('T')[0];
  
  if (schedule.customNonWorkingDays.includes(dateStr)) {
    schedule.customNonWorkingDays = schedule.customNonWorkingDays.filter(d => d !== dateStr);
  } else {
    schedule.customNonWorkingDays.push(dateStr);
  }
  
  saveWorkSchedule(schedule);
};
