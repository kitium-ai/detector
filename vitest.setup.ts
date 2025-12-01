import { vi } from 'vitest';

// Mock the logger module to avoid loading issues
vi.mock('@kitiumai/logger', () => ({
  getLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
    log: vi.fn(),
  }),
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
    log: vi.fn(),
  }),
}));

// Provide jest-like API for backwards compatibility
globalThis.jest = {
  spyOn: (obj: unknown, method: string) => vi.spyOn(obj as object, method as keyof typeof obj),
  fn: (implementation?: ((...args: unknown[]) => unknown) | undefined) => vi.fn(implementation),
  restoreAllMocks: () => vi.restoreAllMocks(),
  clearAllMocks: () => vi.clearAllMocks(),
} as unknown;
