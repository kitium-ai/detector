/**
 * Cache Utility for Detection Results
 */

import type { CacheAdapter, DetectionResult } from '../types/index.js';
import { getLogger } from '@kitiumai/logger';
import { createCacheOperationError, extractErrorMetadata } from './errors.js';

const logger = getLogger();

const CACHE_KEY = '__kitium_detection_cache__';
const DEFAULT_TTL = 1000 * 60 * 5; // 5 minutes

interface CacheEntry {
  data: DetectionResult;
  expiresAt: number;
}

class InMemoryCacheAdapter implements CacheAdapter {
  private store: CacheEntry | null = null;

  get(): DetectionResult | null {
    if (!this.store) {
      return null;
    }

    if (Date.now() > this.store.expiresAt) {
      this.store = null;
      return null;
    }

    return this.store.data;
  }

  set(data: DetectionResult, ttlMs = DEFAULT_TTL): void {
    this.store = {
      data,
      expiresAt: Date.now() + ttlMs,
    };
  }

  clear(): void {
    this.store = null;
  }
}

let adapter: CacheAdapter = new InMemoryCacheAdapter();
let ttl = DEFAULT_TTL;

/**
 * Configure cache adapter and TTL
 */
export function configureCache(options: { adapter?: CacheAdapter; ttlMs?: number } = {}): void {
  const startTime = Date.now();

  try {
    if (options.adapter) {
      adapter = options.adapter;
    }
    if (typeof options.ttlMs === 'number') {
      ttl = options.ttlMs;
    }

    const duration = Date.now() - startTime;
    logger.debug('Cache configured', {
      duration,
      hasAdapter: options.adapter !== undefined,
      ttlMs: options.ttlMs,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const caughtError = createCacheOperationError(
      'configure',
      error instanceof Error ? error.message : String(error),
      { duration, ttlMs: options.ttlMs }
    );

    const errorMetadata = extractErrorMetadata(caughtError);
    logger.warn('Cache configuration failed', { ...errorMetadata, duration, error });
  }
}

/**
 * Get cached detection result
 */
export function getCached(): DetectionResult | null {
  const startTime = Date.now();

  try {
    const cached = adapter.get();

    if (cached) {
      const duration = Date.now() - startTime;
      logger.debug('Cache hit', { duration, source: 'adapter' });
      return cached;
    }

    if (typeof window !== 'undefined') {
      const winEntry = (window as unknown as Record<string, unknown>)[CACHE_KEY] as
        | CacheEntry
        | undefined;
      if (winEntry && Date.now() <= winEntry.expiresAt) {
        const duration = Date.now() - startTime;
        logger.debug('Cache hit', { duration, source: 'window' });
        return winEntry.data;
      }
    }

    const duration = Date.now() - startTime;
    logger.debug('Cache miss', { duration });
    return null;
  } catch (error) {
    const duration = Date.now() - startTime;
    const caughtError = createCacheOperationError(
      'get',
      error instanceof Error ? error.message : String(error),
      { duration }
    );

    const errorMetadata = extractErrorMetadata(caughtError);
    logger.warn('Failed to retrieve cached detection result', {
      ...errorMetadata,
      duration,
      error,
    });
    return null;
  }
}

/**
 * Set cached detection result
 */
export function setCached(data: DetectionResult): void {
  const startTime = Date.now();

  try {
    adapter.set(data, ttl);

    if (typeof window !== 'undefined') {
      const entry: CacheEntry = {
        data,
        expiresAt: Date.now() + ttl,
      };
      (window as unknown as Record<string, unknown>)[CACHE_KEY] = entry;
    }

    const duration = Date.now() - startTime;
    logger.debug('Cache set successfully', {
      duration,
      ttlMs: ttl,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const caughtError = createCacheOperationError(
      'set',
      error instanceof Error ? error.message : String(error),
      { duration, ttlMs: ttl }
    );

    const errorMetadata = extractErrorMetadata(caughtError);
    logger.warn('Failed to cache detection result', { ...errorMetadata, duration, error });
  }
}

/**
 * Clear cached detection result
 */
export function clearCache(): void {
  const startTime = Date.now();

  try {
    adapter.clear();

    if (typeof window !== 'undefined') {
      delete (window as unknown as Record<string, unknown>)[CACHE_KEY];
    }

    const duration = Date.now() - startTime;
    logger.debug('Cache cleared successfully', { duration });
  } catch (error) {
    const duration = Date.now() - startTime;
    const caughtError = createCacheOperationError(
      'clear',
      error instanceof Error ? error.message : String(error),
      { duration }
    );

    const errorMetadata = extractErrorMetadata(caughtError);
    logger.warn('Failed to clear cached detection result', { ...errorMetadata, duration, error });
  }
}
