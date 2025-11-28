/**
 * Cache Utility for Detection Results
 */

import type { CacheAdapter, DetectionResult } from '../types';
import { getLogger } from '@kitiumai/logger';

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
  if (options.adapter) {
    adapter = options.adapter;
  }
  if (typeof options.ttlMs === 'number') {
    ttl = options.ttlMs;
  }
}

/**
 * Get cached detection result
 */
export function getCached(): DetectionResult | null {
  try {
    const cached = adapter.get();

    if (cached) {
      return cached;
    }

    if (typeof window !== 'undefined') {
      const winEntry = (window as any)[CACHE_KEY] as CacheEntry | undefined;
      if (winEntry && Date.now() <= winEntry.expiresAt) {
        return winEntry.data;
      }
    }
    return null;
  } catch (error) {
    logger.warn('Failed to retrieve cached detection result', { error });
    return null;
  }
}

/**
 * Set cached detection result
 */
export function setCached(data: DetectionResult): void {
  try {
    adapter.set(data, ttl);
    if (typeof window !== 'undefined') {
      const entry: CacheEntry = {
        data,
        expiresAt: Date.now() + ttl,
      };
      (window as any)[CACHE_KEY] = entry;
    }
  } catch (error) {
    logger.warn('Failed to cache detection result', { error });
  }
}

/**
 * Clear cached detection result
 */
export function clearCache(): void {
  try {
    adapter.clear();
    if (typeof window !== 'undefined') {
      delete (window as any)[CACHE_KEY];
    }
  } catch (error) {
    logger.warn('Failed to clear cached detection result', { error });
  }
}
