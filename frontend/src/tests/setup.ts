import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// ✅ Очистка после каждого теста
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});

// ✅ Mock для localStorage (если jsdom не поддерживает)
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// ✅ Mock для matchMedia (для responsive компонентов)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ✅ Mock для window.confirm и window.alert
globalThis.confirm = vi.fn(() => true);
globalThis.alert = vi.fn();

// ✅ Подавление console.error в тестах (опционально)
// const originalError = console.error;
// beforeAll(() => {
//   console.error = vi.fn();
// });
// afterAll(() => {
//   console.error = originalError;
// });
