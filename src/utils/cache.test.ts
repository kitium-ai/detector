import { vi } from 'vitest';
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

import { getCached, setCached, clearCache, configureCache } from './cache';

describe('cache utility', () => {
  const CACHE_KEY = '__kitium_detection_cache__';
  const mockData = { foo: 'bar' } as any;
  let originalWindow: any;

  beforeEach(() => {
    originalWindow = { ...window };
    clearCache();
  });

  afterEach(() => {
    clearCache();
    // Restore window state
    for (const key in window) {
      if (!(key in originalWindow)) {
        try {
          delete (window as any)[key];
        } catch {
          // Ignore errors when deleting properties
        }
      }
    }
    try {
      Object.assign(window, originalWindow);
    } catch {
      // Ignore errors when restoring window
    }
  });

  it('should return null if window is undefined', () => {
    const origWindow = global.window;
    // @ts-expect-error - Testing behavior when window is undefined
    delete global.window;
    expect(getCached()).toBeNull();
    global.window = origWindow;
  });

  it('should return null if nothing is cached', () => {
    expect(getCached()).toBeNull();
  });

  it('should cache and retrieve data', () => {
    setCached(mockData);
    expect(getCached()).toEqual(mockData);
  });

  it('should clear the cache', () => {
    setCached(mockData);
    clearCache();
    expect(getCached()).toBeNull();
  });

  it('should expire cache after max age', () => {
    // Use a no-op adapter to test window cache expiration
    configureCache({
      adapter: {
        get: () => null,
        set: () => {},
        clear: () => {},
      },
    });
    setCached(mockData);
    // Manually expire the window cache entry
    const entry = (window as any)[CACHE_KEY];
    entry.expiresAt = Date.now() - 1000; // Expired 1 second ago
    expect(getCached()).toBeNull();
  });

  it('should handle errors gracefully in getCached', () => {
    Object.defineProperty(window, CACHE_KEY, {
      get() {
        throw new Error('fail');
      },
      configurable: true,
    });
    expect(getCached()).toBeNull();
    delete (window as any)[CACHE_KEY];
  });

  it('should handle errors gracefully in setCached', () => {
    Object.defineProperty(window, CACHE_KEY, {
      set() {
        throw new Error('fail');
      },
      configurable: true,
    });
    expect(() => setCached(mockData)).not.toThrow();
    delete (window as any)[CACHE_KEY];
  });

  it('should handle errors gracefully in clearCache', () => {
    Object.defineProperty(window, CACHE_KEY, {
      configurable: true,
      get() {
        throw new Error('fail');
      },
    });
    expect(() => clearCache()).not.toThrow();
    delete (window as any)[CACHE_KEY];
  });
});
