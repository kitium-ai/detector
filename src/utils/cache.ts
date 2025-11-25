/**
 * Cache Utility for Detection Results
 */

import type { DetectionResult } from '../types';
import { LoggerFactory, LoggerType } from '@kitiumai/logger';

const logger = LoggerFactory.create({
  type: LoggerType.CONSOLE,
  serviceName: '@kitiumai/detector:cache',
  includeTimestamp: false,
  colors: false,
});

const CACHE_KEY = '__kitium_detection_cache__';
const MAX_CACHE_AGE = 1000 * 60 * 5; // 5 minutes

interface CacheEntry {
  data: DetectionResult;
  timestamp: number;
}

/**
 * Get cached detection result
 */
export function getCached(): DetectionResult | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cached = (window as any)[CACHE_KEY] as CacheEntry | undefined;

    if (!cached) {
      return null;
    }

    const age = Date.now() - cached.timestamp;

    if (age > MAX_CACHE_AGE) {
      delete (window as any)[CACHE_KEY];
      return null;
    }

    return cached.data;
  } catch (error) {
    logger.warn('Failed to retrieve cached detection result', { error });
    return null;
  }
}

/**
 * Set cached detection result
 */
export function setCached(data: DetectionResult): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
    };

    (window as any)[CACHE_KEY] = entry;
  } catch (error) {
    logger.warn('Failed to cache detection result', { error });
  }
}

/**
 * Clear cached detection result
 */
export function clearCache(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    delete (window as any)[CACHE_KEY];
  } catch (error) {
    logger.warn('Failed to clear cached detection result', { error });
  }
}
