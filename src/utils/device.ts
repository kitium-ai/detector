/**
 * Device Information Detection
 * Detects device type, screen size, touch support, and orientation
 */

import type { DeviceInfo } from '../types';
import { isBrowser } from '../detectors/platform';

/**
 * Detect device type based on screen size and user agent
 */
function detectDeviceType(): DeviceInfo['type'] {
  if (!isBrowser()) {
    return 'unknown';
  }

  const width = window.screen.width;
  const height = window.screen.height;
  const userAgent = navigator.userAgent.toLowerCase();

  // TV detection (rough heuristic)
  if (userAgent.includes('smart-tv') || userAgent.includes('smarttv')) {
    return 'tv';
  }

  // Tablet detection
  // iPad detection (including iPadOS 13+)
  if (
    /ipad/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ) {
    return 'tablet';
  }

  // Android tablets (rough heuristic)
  if (/android/i.test(navigator.userAgent) && !/mobile/i.test(navigator.userAgent)) {
    return 'tablet';
  }

  // Mobile detection
  if (
    /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent) ||
    (width <= 768 && height <= 1024)
  ) {
    return 'mobile';
  }

  // Desktop (default)
  return 'desktop';
}

/**
 * Get screen information
 */
function getScreenInfo(): DeviceInfo['screen'] {
  if (!isBrowser()) {
    return {
      width: 0,
      height: 0,
      pixelRatio: 1,
    };
  }

  return {
    width: window.screen.width,
    height: window.screen.height,
    pixelRatio: window.devicePixelRatio || 1,
  };
}

/**
 * Detect touch support
 */
function hasTouchSupport(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (!!(window as any).DocumentTouch && document instanceof (window as any).DocumentTouch)
  );
}

/**
 * Detect screen orientation
 */
function getOrientation(): 'portrait' | 'landscape' | undefined {
  if (!isBrowser()) {
    return undefined;
  }

  // Use Screen Orientation API if available
  if ('orientation' in screen) {
    const orientation = (screen as any).orientation;
    if (orientation) {
      const angle = orientation.angle || 0;
      return angle === 90 || angle === -90 || angle === 270 ? 'landscape' : 'portrait';
    }
  }

  // Fallback to window dimensions
  if (window.innerWidth && window.innerHeight) {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }

  return undefined;
}

/**
 * Detect complete device information
 */
export function detectDeviceInfo(): DeviceInfo {
  return {
    type: detectDeviceType(),
    screen: getScreenInfo(),
    touch: hasTouchSupport(),
    orientation: getOrientation(),
  };
}
