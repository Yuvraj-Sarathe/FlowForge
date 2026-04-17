import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock crypto.randomUUID
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
  },
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Mock navigator.onLine
Object.defineProperty(globalThis, 'navigator', {
  value: {
    onLine: true,
  },
  writable: true,
});

// Global fetch mock
globalThis.fetch = vi.fn();

// Mock IntersectionObserver for @tanstack/react-virtual
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock React 18's useId
vi.mock('react', () => ({
  ...vi.importActual('react'),
  useId: () => 'test-id-' + Math.random().toString(36).substr(2, 9),
}));