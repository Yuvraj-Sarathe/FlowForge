import { collection, doc, setDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Routine } from '../contexts/TaskContext';

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
  lastCompleted?: number;
}

interface HabitCompletion {
  routineId: string;
  syncId: string;
  timestamp: number;
  date: string; // YYYY-MM-DD format
}

export const recordCompletion = async (routineId: string, syncId: string) => {
  const now = Date.now();
  const date = new Date(now);
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
  const completion: HabitCompletion = {
    routineId,
    syncId,
    timestamp: now,
    date: dateStr,
  };
  
  const docId = `${routineId}_${dateStr}`;
  await setDoc(doc(db, 'habitCompletions', docId), completion);
};

export const getHabitStats = async (routine: Routine, syncId: string): Promise<HabitStats> => {
  const q = query(
    collection(db, 'habitCompletions'),
    where('routineId', '==', routine.id),
    where('syncId', '==', syncId)
  );
  
  const snapshot = await getDocs(q);
  const completions: number[] = [];
  
  snapshot.forEach(doc => {
    const data = doc.data() as HabitCompletion;
    completions.push(data.timestamp);
  });
  
  completions.sort((a, b) => b - a);
  
  const currentStreak = calculateCurrentStreak(completions);
  const longestStreak = calculateLongestStreak(completions);
  const totalCompletions = completions.length;
  
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const recentCompletions = completions.filter(t => t > thirtyDaysAgo).length;
  const completionRate = Math.round((recentCompletions / 30) * 100);
  
  const lastCompleted = completions.length > 0 ? completions[0] : undefined;
  
  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate,
    lastCompleted,
  };
};

const calculateCurrentStreak = (completions: number[]): number => {
  if (completions.length === 0) return 0;
  
  const dayGroups = new Set<string>();
  completions.forEach(timestamp => {
    const date = new Date(timestamp);
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    dayGroups.add(dayKey);
  });
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dayKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
    
    if (dayGroups.has(dayKey)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
};

const calculateLongestStreak = (completions: number[]): number => {
  if (completions.length === 0) return 0;
  
  const dayGroups = new Set<string>();
  completions.forEach(timestamp => {
    const date = new Date(timestamp);
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    dayGroups.add(dayKey);
  });
  
  const sortedDays = Array.from(dayGroups).sort();
  let maxStreak = 0;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedDays.length; i++) {
    const prevDate = new Date(sortedDays[i - 1]);
    const currDate = new Date(sortedDays[i]);
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000));
    
    if (diffDays === 1) {
      currentStreak++;
    } else {
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 1;
    }
  }
  
  return Math.max(maxStreak, currentStreak);
};

export const getWeeklyProgress = async (routine: Routine, syncId: string): Promise<boolean[]> => {
  const q = query(
    collection(db, 'habitCompletions'),
    where('routineId', '==', routine.id),
    where('syncId', '==', syncId)
  );
  
  const snapshot = await getDocs(q);
  const completionDates = new Set<string>();
  
  snapshot.forEach(doc => {
    const data = doc.data() as HabitCompletion;
    completionDates.add(data.date);
  });
  
  const weekProgress: boolean[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    weekProgress.push(completionDates.has(dateStr));
  }
  
  return weekProgress;
};
