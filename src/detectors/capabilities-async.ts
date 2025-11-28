/**
 * Async Capability Detection
 * For features that require permissions or async checks
 */

import { isBrowser } from './platform';

/**
 * Async capability detection result
 */
export interface AsyncCapabilityResult {
  camera: boolean;
  microphone: boolean;
  geolocation: boolean;
  notification: boolean;
}

/**
 * Check camera permission (async)
 */
export async function hasCameraAsync(): Promise<boolean> {
  if (!isBrowser()) {
    return false;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}

/**
 * Check microphone permission (async)
 */
export async function hasMicrophoneAsync(): Promise<boolean> {
  if (!isBrowser()) {
    return false;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}

/**
 * Check geolocation permission (async)
 */
export async function hasGeolocationAsync(): Promise<boolean> {
  if (!isBrowser()) {
    return false;
  }

  if (!('geolocation' in navigator)) {
    return false;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
      { timeout: 1000 }
    );
  });
}

/**
 * Check notification permission (async)
 */
export async function hasNotificationAsync(): Promise<boolean> {
  if (!isBrowser()) {
    return false;
  }

  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  // Request permission
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch {
    return false;
  }
}

/**
 * Detect async capabilities
 */
export async function detectCapabilitiesAsync(): Promise<AsyncCapabilityResult> {
  const [camera, microphone, geolocation, notification] = await Promise.all([
    hasCameraAsync(),
    hasMicrophoneAsync(),
    hasGeolocationAsync(),
    hasNotificationAsync(),
  ]);

  return {
    camera,
    microphone,
    geolocation,
    notification,
  };
}
