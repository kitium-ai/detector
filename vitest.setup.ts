import { vi } from 'vitest';

// Mock the logger module to avoid loading issues
vi.mock('@kitiumai/logger', () => ({
  getLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

// Provide jest-like API for backwards compatibility
globalThis.jest = {
  restoreAllMocks: () => vi.restoreAllMocks(),
  clearAllMocks: () => vi.clearAllMocks(),
  spyOn: (obj: any, method: string) => vi.spyOn(obj, method as any),
  fn: (implementation?: any) => vi.fn(implementation),
  mock: () => {},
  unmock: () => {},
} as any;
