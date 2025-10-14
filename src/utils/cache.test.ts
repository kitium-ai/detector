import { getCached, setCached, clearCache } from './cache';

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
        delete (window as any)[key];
      }
    }
    Object.assign(window, originalWindow);
  });

  it('should return null if window is undefined', () => {
    const origWindow = global.window;
    // @ts-ignore
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
    setCached(mockData);
    const entry = (window as any)[CACHE_KEY];
    entry.timestamp = Date.now() - 1000 * 60 * 10; // 10 minutes ago
    expect(getCached()).toBeNull();
  });

  it('should handle errors gracefully in getCached', () => {
    Object.defineProperty(window, CACHE_KEY, {
      get() { throw new Error('fail'); },
      configurable: true,
    });
    expect(getCached()).toBeNull();
    delete (window as any)[CACHE_KEY];
  });

  it('should handle errors gracefully in setCached', () => {
    Object.defineProperty(window, CACHE_KEY, {
      set() { throw new Error('fail'); },
      configurable: true,
    });
    expect(() => setCached(mockData)).not.toThrow();
    delete (window as any)[CACHE_KEY];
  });

  it('should handle errors gracefully in clearCache', () => {
    Object.defineProperty(window, CACHE_KEY, {
      configurable: true,
      get() { throw new Error('fail'); },
    });
    expect(() => clearCache()).not.toThrow();
    delete (window as any)[CACHE_KEY];
  });
});
