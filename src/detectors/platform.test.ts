/**
 * Simplified Platform Detection Tests that work in jsdom
 */

import {
  detectBrowser,
  detectDesktopOS,
  detectMobileOS,
  detectPlatform,
  detectPlatformInfo,
  detectRuntime,
  getBrowserVersion,
  getOSVersion,
  isBrowser,
  isCapacitor,
  isCordova,
  isElectron,
  isMobile,
  isNode,
  isNwjs,
  isReactNative,
  isServiceWorker,
  isWebWorker,
} from './platform';

describe('Platform Detection - Simple Tests', () => {
  // Test functions return expected types
  it('isBrowser should return a boolean', () => {
    expect(typeof isBrowser()).toBe('boolean');
  });

  it('isNode should return a boolean', () => {
    expect(typeof isNode()).toBe('boolean');
  });

  it('isReactNative should return a boolean', () => {
    expect(typeof isReactNative()).toBe('boolean');
  });

  it('isElectron should return a boolean', () => {
    expect(typeof isElectron()).toBe('boolean');
  });

  it('isCapacitor should return a boolean', () => {
    expect(typeof isCapacitor()).toBe('boolean');
  });

  it('isCordova should return a boolean', () => {
    expect(typeof isCordova()).toBe('boolean');
  });

  it('isNwjs should return a boolean', () => {
    expect(typeof isNwjs()).toBe('boolean');
  });

  it('isWebWorker should return a boolean', () => {
    expect(typeof isWebWorker()).toBe('boolean');
  });

  it('isServiceWorker should return a boolean', () => {
    expect(typeof isServiceWorker()).toBe('boolean');
  });

  it('isMobile should return a boolean', () => {
    expect(typeof isMobile()).toBe('boolean');
  });

  it('detectBrowser should return a valid browser type', () => {
    const browser = detectBrowser();
    const validBrowsers = [
      'edge',
      'opera',
      'chrome',
      'firefox',
      'safari',
      'samsung',
      'ie',
      'chromium',
      'unknown',
    ];
    expect(validBrowsers).toContain(browser);
  });

  it('getBrowserVersion should return string or undefined', () => {
    const version = getBrowserVersion();
    expect(version === undefined || typeof version === 'string').toBe(true);
  });

  it('getOSVersion should return string or undefined', () => {
    const version = getOSVersion();
    expect(version === undefined || typeof version === 'string').toBe(true);
  });

  it('detectMobileOS should return a valid OS type', () => {
    const os = detectMobileOS();
    const validOS = ['ios', 'android', 'unknown'];
    expect(validOS).toContain(os);
  });

  it('detectDesktopOS should return a valid OS type', () => {
    const os = detectDesktopOS();
    const validOS = ['windows', 'macos', 'linux', 'chromeos', 'unknown'];
    expect(validOS).toContain(os);
  });

  it('detectPlatform should return a valid platform type', () => {
    const platform = detectPlatform();
    const validPlatforms = [
      'web',
      'node',
      'react-native',
      'electron',
      'capacitor',
      'cordova',
      'nw.js',
      'webworker',
      'serviceworker',
      'unknown',
    ];
    expect(validPlatforms).toContain(platform);
  });

  it('detectRuntime should return a valid runtime type', () => {
    const runtime = detectRuntime();
    const validRuntimes = [
      'browser',
      'node',
      'worker',
      'mobile-native',
      'desktop-native',
      'unknown',
    ];
    expect(validRuntimes).toContain(runtime);
  });

  it('detectPlatformInfo should return complete detection result', () => {
    const result = detectPlatformInfo();
    expect(result).toHaveProperty('platform');
    expect(result).toHaveProperty('runtime');
    expect(result).toHaveProperty('isServer');
    expect(result).toHaveProperty('isBrowser');
    expect(result).toHaveProperty('isMobile');
    expect(result).toHaveProperty('isDesktop');
    expect(result).toHaveProperty('isNative');
    expect(typeof result.isServer).toBe('boolean');
    expect(typeof result.isBrowser).toBe('boolean');
    expect(typeof result.isMobile).toBe('boolean');
    expect(typeof result.isDesktop).toBe('boolean');
    expect(typeof result.isNative).toBe('boolean');
  });
});
