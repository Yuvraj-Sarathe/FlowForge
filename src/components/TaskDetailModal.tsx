import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Task, useTasks } from '../contexts/TaskContext';
import { X, Plus, CheckCircle } from '@phosphor-icons/react';

interface Props {
  task: Task;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<Props> = ({ task, onClose }) => {
  const { updateTask } = useTasks();
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    
    const subtask = {
      id: crypto.randomUUID(),
      title: newSubtask.trim(),
      completed: false
    };

    updateTask(task.id, {
      subtasks: [...(task.subtasks || []), subtask]
    });
    setNewSubtask('');
  };

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = (task.subtasks || []).map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    updateTask(task.id, { subtasks: updatedSubtasks });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-app-card border border-app-border rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b border-app-surface flex justify-between items-center">
          <h2 className="text-xl font-bold text-app-text truncate pr-4">{task.title}</h2>
          <button onClick={onClose} className="p-2 text-app-muted/80 hover:text-app-text transition-colors rounded-full hover:bg-app-bg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-xs uppercase tracking-[0.1em] font-bold text-app-muted mb-4 block">Subtasks</h3>
          
          <div className="space-y-2 mb-6">
            {(task.subtasks || []).map(st => (
              <div key={st.id} className="flex items-center gap-3 group">
                <button onClick={() => toggleSubtask(st.id)} className="shrink-0 transition-colors">
                  {st.completed ? (
                    <div className="w-5 h-5 border-2 border-app-primary bg-app-primary rounded-md flex items-center justify-center">
                      <CheckCircle weight="bold" className="w-4 h-4 text-app-primary-fg" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-app-border rounded-md group-hover:border-app-primary transition-colors" />
                  )}
                </button>
                <span className={`text-sm ${st.completed ? 'line-through text-app-muted/80' : 'text-app-text'}`}>
                  {st.title}
                </span>
              </div>
            ))}
            {(!task.subtasks || task.subtasks.length === 0) && (
              <p className="text-sm text-app-muted italic">No subtasks yet.</p>
            )}
          </div>

          <form onSubmit={handleAddSubtask} className="flex gap-2">
            <input 
              type="text" 
              value={newSubtask}
              onChange={e => setNewSubtask(e.target.value)}
              placeholder="Add a subtask..."
              className="flex-1 bg-app-bg border border-app-border rounded-xl px-4 py-2 text-sm text-app-text focus:border-app-primary outline-none transition-colors"
            />
            <button 
              type="submit"
              disabled={!newSubtask.trim()}
              className="px-4 bg-app-primary text-app-primary-fg rounded-xl flex items-center justify-center disabled:opacity-50 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
