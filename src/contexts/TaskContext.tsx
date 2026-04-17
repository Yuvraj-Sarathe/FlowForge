import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc, updateDoc, limit, orderBy, startAfter } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { addToSyncQueue, getSyncQueue, removeFromSyncQueue } from '../lib/idb';
import { Attachment } from '../lib/storage';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  tags: string[];
  category?: string;
  dueDate?: string;
  duration?: number;
  syncId: string;
  createdAt: number;
  completedAt?: number;
  lastModified?: number;
  subtasks?: Subtask[];
  dependentTaskId?: string;
  calendarEventId?: string;
  googleTaskId?: string;
  googleTaskListId?: string;
  recurring?: boolean;
  recurrenceRule?: 'daily' | 'weekly' | 'monthly';
  recurrenceEnd?: number;
  parentTaskId?: string;
  attachments?: Attachment[];
}

interface TaskContextType {
  tasks: Task[];
  hasMore: boolean;
  loadMore: () => Promise<void>;
  isLoadingMore: boolean;
  addTask: (task: Omit<Task, 'id' | 'syncId' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  isOnline: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const PAGE_SIZE = 50;

/*
 * FIRESTORE INDEXES REQUIRED
 * 
 * The following composite indexes need to be created in Firebase Console
 * for optimal query performance at scale:
 * 
 * 1. tasks collection:
 *    - Fields: syncId (asc), createdAt (desc) - [AUTO-CREATED for main query]
 *    - Fields: syncId (asc), status (asc), createdAt (desc) - [for status filtering + pagination]
 *    - Fields: syncId (asc), category (asc), createdAt (desc) - [for category filtering + pagination]
 * 
 * To create indexes, go to:
 * Firebase Console -> Firestore -> Indexes -> Composite Indexes
 */

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastTask, setLastTask] = useState<Task | null>(null);
  const { syncId } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync offline queue when coming back online
  useEffect(() => {
    if (isOnline && syncId) {
      const syncOfflineData = async () => {
        const queue = await getSyncQueue();
        const itemsToRemove: string[] = [];
        
        for (const item of queue) {
          try {
            if (item.action === 'ADD' || item.action === 'UPDATE') {
              await setDoc(doc(db, item.collection, item.data.id), item.data, { merge: true });
            } else if (item.action === 'DELETE') {
              await deleteDoc(doc(db, item.collection, item.data.id));
            }
            // Only mark for removal AFTER successful sync
            itemsToRemove.push(item.id);
          } catch (e) {
            console.error('Failed to sync item', e);
            // Keep in queue for retry - do NOT remove
          }
        }
        
        // Remove all successfully synced items from queue
        for (const id of itemsToRemove) {
          try {
            await removeFromSyncQueue(id);
          } catch (e) {
            console.error('Failed to remove synced item from queue', e);
          }
        }
      };
      syncOfflineData();
    }
  }, [isOnline, syncId]);

  useEffect(() => {
    if (!syncId) {
      setTasks([]);
      return;
    }

    const q = query(collection(db, 'tasks'), where('syncId', '==', syncId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData: Task[] = [];
      snapshot.forEach((doc) => {
        tasksData.push(doc.data() as Task);
      });
      setTasks(tasksData.sort((a, b) => b.createdAt - a.createdAt));
    }, (error) => {
      console.error('Firestore listen error:', error);
    });

    return unsubscribe;
  }, [syncId]);

  const addTask = async (taskData: Omit<Task, 'id' | 'syncId' | 'createdAt' | 'lastModified'>) => {
    if (!syncId) return;
    const now = Date.now();
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      syncId,
      createdAt: now,
      lastModified: now,
    };

    // Optimistic update
    setTasks(prev => [newTask, ...prev]);

    if (isOnline) {
      try {
        await setDoc(doc(db, 'tasks', newTask.id), newTask);
      } catch (e) {
        console.error('Failed to create task', e);
        await addToSyncQueue('ADD', 'tasks', newTask);
      }
    } else {
      await addToSyncQueue('ADD', 'tasks', newTask);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    // Add completedAt and lastModified timestamps
    const now = Date.now();
    const finalUpdates = updates.status === 'done' 
      ? { ...updates, completedAt: now, lastModified: now }
      : { ...updates, lastModified: now };
    
    const currentTask = tasks.find(t => t.id === id);
    const isCompletingRecurring = currentTask?.status !== 'done' && updates.status === 'done' && currentTask?.recurring;
    
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...finalUpdates } : t));
    
    if (isOnline) {
      try {
        await updateDoc(doc(db, 'tasks', id), finalUpdates);
        
        // If completing a recurring task, create the next instance
        if (isCompletingRecurring && currentTask) {
          const nextDueDate = getNextRecurrenceDate(currentTask.dueDate, currentTask.recurrenceRule!);
          if (nextDueDate && (!currentTask.recurrenceEnd || nextDueDate.getTime() < currentTask.recurrenceEnd)) {
            const nextTask: Task = {
              ...currentTask,
              id: crypto.randomUUID(),
              status: 'todo',
              dueDate: nextDueDate.toISOString(),
              completedAt: undefined,
              createdAt: now,
              lastModified: now,
              parentTaskId: id,
            };
            await setDoc(doc(db, 'tasks', nextTask.id), nextTask);
            setTasks(prev => [nextTask, ...prev]);
          }
        }
      } catch (e) {
        console.error('Failed to update task', e);
        await addToSyncQueue('UPDATE', 'tasks', { id, ...finalUpdates });
      }
    } else {
      await addToSyncQueue('UPDATE', 'tasks', { id, ...finalUpdates });
    }
  };

  const getNextRecurrenceDate = (currentDueDate: string | undefined, rule: 'daily' | 'weekly' | 'monthly'): Date | null => {
    if (!currentDueDate) return null;
    
    const date = new Date(currentDueDate);
    const now = new Date();
    
    switch (rule) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
    }
    
    return date > now ? date : null;
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    
    if (isOnline) {
      try {
        await deleteDoc(doc(db, 'tasks', id));
      } catch (e) {
        console.error('Failed to delete task', e);
        await addToSyncQueue('DELETE', 'tasks', { id });
      }
    } else {
      await addToSyncQueue('DELETE', 'tasks', { id });
    }
  };

  const loadMore = useCallback(async () => {
    if (!syncId || isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const lastTaskDoc = lastTask 
        ? await import('firebase/firestore').then(m => m.doc(db, 'tasks', lastTask.id))
        : null;
      
      const q = lastTaskDoc
        ? query(
            collection(db, 'tasks'),
            where('syncId', '==', syncId),
            orderBy('createdAt', 'desc'),
            startAfter(lastTaskDoc),
            limit(PAGE_SIZE)
          )
        : query(
            collection(db, 'tasks'),
            where('syncId', '==', syncId),
            orderBy('createdAt', 'desc'),
            limit(PAGE_SIZE)
          );
      
      const snapshot = await import('firebase/firestore').then(m => 
        new Promise<any>((resolve) => {
          const unsubscribe = onSnapshot(q, (snap) => {
            resolve(snap);
            unsubscribe();
          }, () => resolve({ empty: true, docs: [] }));
        })
      );
      
      if (snapshot.empty || snapshot.docs.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        const newTasks: Task[] = [];
        snapshot.docs.forEach((docSnap: any) => {
          newTasks.push(docSnap.data() as Task);
        });
        setTasks(prev => [...prev, ...newTasks]);
        setLastTask(newTasks[newTasks.length - 1]);
      }
    } catch (e) {
      console.error('Failed to load more tasks', e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [syncId, isLoadingMore, hasMore, lastTask]);

  return (
    <TaskContext.Provider value={{ tasks, hasMore, loadMore, isLoadingMore, addTask, updateTask, deleteTask, isOnline }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
