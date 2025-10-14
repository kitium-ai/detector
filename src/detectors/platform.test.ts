/**
 * Platform Detection Tests
 */

import {
  detectBrowser,
  detectDesktopOS,
  detectMobileOS,
  detectPlatform,
  detectPlatformInfo,
  detectRuntime,
  getBrowserVersion,
  isBrowser,
  isCapacitor,
  isCordova,
  isElectron,
  isMobile,
  isNode,
  isReactNative,
} from './platform';

describe('Platform Detection', () => {
  describe('isNode', () => {
    it('should detect Node.js environment', () => {
      // In jsdom environment, this will be false
      expect(typeof isNode()).toBe('boolean');
    });
  });

  describe('isBrowser', () => {
    it('should detect browser environment', () => {
      expect(isBrowser()).toBe(true); // jsdom environment
    });
  });

  describe('isReactNative', () => {
    it('should return false in jsdom environment', () => {
      expect(isReactNative()).toBe(false);
    });

    it('should detect React Native when navigator.product is ReactNative', () => {
      const originalProduct = Object.getOwnPropertyDescriptor(
        Navigator.prototype,
        'product'
      );

      Object.defineProperty(Navigator.prototype, 'product', {
        get: () => 'ReactNative',
        configurable: true,
      });

      expect(isReactNative()).toBe(true);

      // Restore
      if (originalProduct) {
        Object.defineProperty(Navigator.prototype, 'product', originalProduct);
      }
    });
  });

  describe('isElectron', () => {
    it('should return false in standard browser', () => {
      expect(isElectron()).toBe(false);
    });

    it('should detect Electron environment', () => {
      (window as any).process = { type: 'renderer' };
      expect(isElectron()).toBe(true);
      delete (window as any).process;
    });
  });

  describe('isCapacitor', () => {
    it('should return false when Capacitor is not present', () => {
      expect(isCapacitor()).toBe(false);
    });

    it('should detect Capacitor environment', () => {
      (window as any).Capacitor = {};
      expect(isCapacitor()).toBe(true);
      delete (window as any).Capacitor;
    });
  });

  describe('isCordova', () => {
    it('should return false when Cordova is not present', () => {
      expect(isCordova()).toBe(false);
    });

    it('should detect Cordova environment', () => {
      (window as any).cordova = {};
      expect(isCordova()).toBe(true);
      delete (window as any).cordova;
    });
  });

  describe('detectBrowser', () => {
    it('should detect browser type', () => {
      const browser = detectBrowser();
      expect(browser).toBeDefined();
      expect(typeof browser).toBe('string');
    });
  });

  describe('getBrowserVersion', () => {
    it('should return browser version or undefined', () => {
      const version = getBrowserVersion();
      expect(version === undefined || typeof version === 'string').toBe(true);
    });
  });

  describe('isMobile', () => {
    it('should detect mobile device', () => {
      expect(typeof isMobile()).toBe('boolean');
    });
  });

  describe('detectMobileOS', () => {
    it('should detect mobile OS', () => {
      const os = detectMobileOS();
      expect(['ios', 'android', 'unknown']).toContain(os);
    });
  });

  describe('detectDesktopOS', () => {
    it('should detect desktop OS', () => {
      const os = detectDesktopOS();
      expect(['windows', 'macos', 'linux', 'chromeos', 'unknown']).toContain(os);
    });
  });

  describe('detectPlatform', () => {
    it('should detect platform type', () => {
      const platform = detectPlatform();
      expect(platform).toBeDefined();
      expect([
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
      ]).toContain(platform);
    });
  });

  describe('detectRuntime', () => {
    it('should detect runtime type', () => {
      const runtime = detectRuntime();
      expect(runtime).toBeDefined();
      expect([
        'browser',
        'node',
        'worker',
        'mobile-native',
        'desktop-native',
        'unknown',
      ]).toContain(runtime);
    });
  });

  describe('detectPlatformInfo', () => {
    it('should return complete platform detection result', () => {
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

    it('should include OS information', () => {
      const result = detectPlatformInfo();

      expect(result).toHaveProperty('os');
      if (result.os) {
        expect(result.os).toHaveProperty('name');
        expect(typeof result.os.name).toBe('string');
      }
    });

    it('should include browser information when in browser', () => {
      const result = detectPlatformInfo();

      if (result.isBrowser) {
        expect(result).toHaveProperty('browser');
        expect(result.browser).toHaveProperty('name');
        expect(typeof result.browser.name).toBe('string');
      }
    });
  });
});
