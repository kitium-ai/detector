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

// Mock the error module
vi.mock('@kitiumai/error', () => {
  class KitiumError extends Error {
    code: string;
    statusCode: number;
    severity: string;
    kind: string;
    retryable: boolean;
    help?: string;
    docs?: string;
    context?: Record<string, unknown>;

    constructor(options: {
      code: string;
      message: string;
      statusCode: number;
      severity: string;
      kind: string;
      retryable: boolean;
      help?: string;
      docs?: string;
      context?: Record<string, unknown>;
    }) {
      super(options.message);
      this.name = 'KitiumError';
      this.code = options.code;
      this.statusCode = options.statusCode;
      this.severity = options.severity;
      this.kind = options.kind;
      this.retryable = options.retryable;
      this.help = options.help;
      this.docs = options.docs;
      this.context = options.context;
    }

    toJSON() {
      return {
        name: this.name,
        code: this.code,
        message: this.message,
        statusCode: this.statusCode,
        severity: this.severity,
        kind: this.kind,
        retryable: this.retryable,
        help: this.help,
        docs: this.docs,
        context: this.context,
      };
    }
  }

  return { KitiumError };
});

// Provide jest-like API for backwards compatibility
globalThis.jest = {
  restoreAllMocks: () => vi.restoreAllMocks(),
  clearAllMocks: () => vi.clearAllMocks(),
  spyOn: (obj: any, method: string) => vi.spyOn(obj, method as any),
  fn: (implementation?: any) => vi.fn(implementation),
  mock: () => {},
  unmock: () => {},
} as any;
