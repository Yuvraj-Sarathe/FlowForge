import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface KeyboardShortcutHandler {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

const DEFAULT_SHORTCUTS: KeyboardShortcutHandler[] = [
  { key: 'n', action: () => {}, description: 'Focus new task input' },
  { key: 't', action: () => {}, description: 'Go to Timer' },
  { key: '/', action: () => {}, description: 'Focus search' },
  { key: 'Escape', action: () => {}, description: 'Close modal/Clear selection' },
  { key: 'j', action: () => {}, description: 'Select next task' },
  { key: 'k', action: () => {}, description: 'Select previous task' },
  { key: 'e', action: () => {}, description: 'Edit selected task' },
  { key: 'm', action: () => {}, description: 'Toggle task completion' },
  { key: 's', action: () => {}, description: 'Go to Settings' },
  { key: 'd', action: () => {}, description: 'Go to Dashboard' },
];

export const useKeyboardShortcuts = (
  callbacks: Partial<Record<string, () => void>> = {}
) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, shiftKey, metaKey } = event;
    const modifier = ctrlKey || metaKey;

    // Don't trigger in input fields (except for specific shortcuts)
    const target = event.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.isContentEditable;

    // Global shortcuts that work everywhere
    if (key === 'Escape' && !isInput) {
      callbacks.onEscape?.();
      return;
    }

    // Only trigger non-modifier shortcuts outside inputs
    if (isInput && !modifier) return;

    switch (key.toLowerCase()) {
      case 'n':
        if (!modifier) {
          event.preventDefault();
          callbacks.onNewTask?.();
        }
        break;
      case 't':
        if (!modifier) {
          event.preventDefault();
          navigate('/timer');
        }
        break;
      case '/':
        if (!modifier) {
          event.preventDefault();
          callbacks.onSearch?.();
        }
        break;
      case 's':
        if (!modifier) {
          event.preventDefault();
          navigate('/settings');
        }
        break;
      case 'd':
        if (!modifier) {
          event.preventDefault();
          navigate('/');
        }
        break;
      case 'l':
        if (!modifier) {
          event.preventDefault();
          navigate('/link');
        }
        break;
      case 'j':
        if (!modifier && !isInput) {
          event.preventDefault();
          callbacks.onNextTask?.();
        }
        break;
      case 'k':
        if (!modifier && !isInput) {
          event.preventDefault();
          callbacks.onPrevTask?.();
        }
        break;
      case 'e':
        if (!modifier && !isInput) {
          event.preventDefault();
          callbacks.onEditTask?.();
        }
        break;
      case 'm':
        if (!modifier && !isInput) {
          event.preventDefault();
          callbacks.onToggleTask?.();
        }
        break;
      case '?':
        if (shiftKey && !modifier) {
          event.preventDefault();
          callbacks.onHelp?.();
        }
        break;
    }
  }, [navigate, location, callbacks]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export const getShortcutDescription = (key: string): string => {
  const shortcuts: Record<string, string> = {
    'n': 'New task',
    't': 'Go to Timer',
    '/': 'Focus search',
    'Escape': 'Close/Clear',
    'j': 'Next task',
    'k': 'Previous task',
    'e': 'Edit task',
    'm': 'Toggle complete',
    's': 'Settings',
    'd': 'Dashboard',
    'l': 'Link device',
    '?': 'Show shortcuts',
  };
  return shortcuts[key] || key;
};

export const KEYBOARD_SHORTCUTS = [
  { key: 'n', description: 'New task' },
  { key: 't', description: 'Timer' },
  { key: 'd', description: 'Dashboard' },
  { key: 's', description: 'Settings' },
  { key: 'l', description: 'Link device' },
  { key: '/', description: 'Search' },
  { key: 'j', description: 'Next task' },
  { key: 'k', description: 'Previous task' },
  { key: 'e', description: 'Edit task' },
  { key: 'm', description: 'Toggle complete' },
  { key: 'Escape', description: 'Close modal' },
  { key: '?', description: 'Show all shortcuts' },
];