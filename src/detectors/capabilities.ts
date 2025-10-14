/**
 * Capabilities Detection Module
 * Detects browser and platform capabilities
 */

import type { CapabilityDetectionResult } from '../types';
import { isBrowser } from './platform';

/**
 * Check if Web Components are supported
 */
export function hasWebComponents(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return !!(
    window.customElements &&
    typeof window.customElements.define === 'function'
  );
}

/**
 * Check if Shadow DOM is supported
 */
export function hasShadowDOM(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return (
    'attachShadow' in Element.prototype &&
    'getRootNode' in Element.prototype
  );
}

/**
 * Check if Custom Elements are supported
 */
export function hasCustomElements(): boolean {
  return hasWebComponents();
}

/**
 * Check if ES Modules are supported
 */
export function hasModules(): boolean {
  if (!isBrowser()) {
    return true; // Assume Node.js has module support
  }

  const script = document.createElement('script');
  return 'noModule' in script;
}

/**
 * Check if Service Worker is supported
 */
export function hasServiceWorker(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return 'serviceWorker' in navigator;
}

/**
 * Check if Web Worker is supported
 */
export function hasWebWorker(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return typeof Worker !== 'undefined';
}

/**
 * Check if IndexedDB is supported
 */
export function hasIndexedDB(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return 'indexedDB' in window;
}

/**
 * Check if localStorage is supported
 */
export function hasLocalStorage(): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if sessionStorage is supported
 */
export function hasSessionStorage(): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    const testKey = '__sessionStorage_test__';
    sessionStorage.setItem(testKey, 'test');
    sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if WebSocket is supported
 */
export function hasWebSocket(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return 'WebSocket' in window;
}

/**
 * Check if WebGL is supported
 */
export function hasWebGL(): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

/**
 * Check if WebGL2 is supported
 */
export function hasWebGL2(): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return !!gl;
  } catch {
    return false;
  }
}

/**
 * Check if Canvas is supported
 */
export function hasCanvas(): boolean {
  if (!isBrowser()) {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  } catch {
    return false;
  }
}

/**
 * Check if Audio is supported
 */
export function hasAudio(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return typeof Audio !== 'undefined';
}

/**
 * Check if Video is supported
 */
export function hasVideo(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return typeof HTMLVideoElement !== 'undefined';
}

/**
 * Check if Geolocation is supported
 */
export function hasGeolocation(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return 'geolocation' in navigator;
}

/**
 * Check if Notification is supported
 */
export function hasNotification(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return 'Notification' in window;
}

/**
 * Check if Camera/getUserMedia is supported
 */
export function hasCamera(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia
  );
}

/**
 * Check if Microphone is supported
 */
export function hasMicrophone(): boolean {
  return hasCamera(); // Same API as camera
}

/**
 * Detect all capabilities
 */
export function detectCapabilities(): CapabilityDetectionResult {
  return {
    webComponents: hasWebComponents(),
    shadowDOM: hasShadowDOM(),
    customElements: hasCustomElements(),
    modules: hasModules(),
    serviceWorker: hasServiceWorker(),
    webWorker: hasWebWorker(),
    indexedDB: hasIndexedDB(),
    localStorage: hasLocalStorage(),
    sessionStorage: hasSessionStorage(),
    websocket: hasWebSocket(),
    webgl: hasWebGL(),
    webgl2: hasWebGL2(),
    canvas: hasCanvas(),
    audio: hasAudio(),
    video: hasVideo(),
    geolocation: hasGeolocation(),
    notification: hasNotification(),
    camera: hasCamera(),
    microphone: hasMicrophone(),
  };
}
