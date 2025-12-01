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
import * as exported from './index';
import { detect, detectPlatform, getSummary } from './index';

describe('index.ts', () => {
  it('should export expected modules', () => {
    expect(exported).toBeDefined();
    // Optionally check for specific exports if known
  });
});

describe('detect function', () => {
  afterEach(() => {
    exported.clearCache();
  });

  it('should return detection results with default options', () => {
    const result = detect();
    expect(result).toHaveProperty('platform');
    expect(result).toHaveProperty('framework');
    expect(result).toHaveProperty('capabilities');
    expect(result).toHaveProperty('timestamp');
  });

  it('should cache results when cache is true', () => {
    exported.clearCache();
    const result1 = detect({ cache: true });
    const result2 = detect({ cache: true });
    expect(result1.timestamp).toBe(result2.timestamp);
  });

  it('should not cache results when cache is false', () => {
    exported.clearCache();
    const result1 = detect({ cache: false });
    // Wait a bit to ensure different timestamps
    const result2 = detect({ cache: false });
    // They might have same timestamp if called too quickly, but should be different objects
    expect(result1).not.toBe(result2);
  });

  it('should allow custom platform detection', () => {
    const result = detect({
      custom: {
        platform: () => ({ customProp: 'test' }) as any,
      },
    });
    expect((result.platform as any).customProp).toBe('test');
  });

  it('should allow custom framework detection', () => {
    const result = detect({
      custom: {
        framework: () => ({ customFramework: 'custom' }) as any,
      },
    });
    expect((result.framework as any).customFramework).toBe('custom');
  });

  it('should skip capabilities detection when detectCaps is false', () => {
    const result = detect({ capabilities: false });
    expect(result.capabilities.webComponents).toBe(false);
    expect(result.capabilities.modules).toBe(false);
  });

  it('should include capabilities when detectCaps is true', () => {
    const result = detect({ capabilities: true });
    expect(result.capabilities).toBeDefined();
    expect(typeof result.capabilities.webComponents).toBe('boolean');
  });
});

describe('getSummary function', () => {
  it('should return summary based on detection', () => {
    const result = detect();
    const summary = getSummary(result);
    expect(typeof summary).toBe('string');
    expect(summary.length).toBeGreaterThan(0);
  });

  it('should work without passing result', () => {
    const summary = getSummary();
    expect(typeof summary).toBe('string');
  });
});

describe('detectPlatform function', () => {
  it('should detect platform with default options', () => {
    const result = detectPlatform();
    expect(result).toHaveProperty('platform');
    expect(result).toHaveProperty('runtime');
    expect(typeof result.platform).toBe('string');
  });

  it('should detect platform with cache', () => {
    exported.clearCache();
    const result1 = detectPlatform({ cache: true });
    const result2 = detectPlatform({ cache: true });
    expect(result1.platform).toBe(result2.platform);
  });

  it('should allow custom platform detection', () => {
    const result = detectPlatform({
      custom: {
        platform: () => ({ customProp: 'test' }) as any,
      },
    });
    expect((result as any).customProp).toBe('test');
  });
});

describe('index.ts exports', () => {
  it('should export all platform detection functions', () => {
    expect(exported.isNode).toBeInstanceOf(Function);
    expect(exported.isBrowser).toBeInstanceOf(Function);
    expect(exported.isReactNative).toBeInstanceOf(Function);
    expect(exported.isElectron).toBeInstanceOf(Function);
    expect(exported.isCapacitor).toBeInstanceOf(Function);
    expect(exported.isCordova).toBeInstanceOf(Function);
    expect(exported.isNwjs).toBeInstanceOf(Function);
    expect(exported.isWebWorker).toBeInstanceOf(Function);
    expect(exported.isServiceWorker).toBeInstanceOf(Function);
    expect(exported.detectBrowser).toBeInstanceOf(Function);
    expect(exported.detectDesktopOS).toBeInstanceOf(Function);
    expect(exported.detectMobileOS).toBeInstanceOf(Function);
    expect(exported.detectPlatformInfo).toBeInstanceOf(Function);
    expect(exported.detectRuntime).toBeInstanceOf(Function);
    expect(exported.getBrowserVersion).toBeInstanceOf(Function);
    expect(exported.getOSVersion).toBeInstanceOf(Function);
    expect(exported.isMobile).toBeInstanceOf(Function);
  });
  it('should export all framework detection functions', () => {
    expect(exported.isAngular).toBeInstanceOf(Function);
    expect(exported.isFlutter).toBeInstanceOf(Function);
    expect(exported.isGatsby).toBeInstanceOf(Function);
    expect(exported.isNextJS).toBeInstanceOf(Function);
    expect(exported.isNuxt).toBeInstanceOf(Function);
    expect(exported.isReact).toBeInstanceOf(Function);
    expect(exported.isRemix).toBeInstanceOf(Function);
    expect(exported.isSvelte).toBeInstanceOf(Function);
    expect(exported.isVue).toBeInstanceOf(Function);
    expect(exported.shouldUseReactNative).toBeInstanceOf(Function);
    expect(exported.shouldUseReactWrapper).toBeInstanceOf(Function);
    expect(exported.shouldUseWebComponents).toBeInstanceOf(Function);
    expect(exported.detectFrameworkInfo).toBeInstanceOf(Function);
    expect(exported.getAngularVersion).toBeInstanceOf(Function);
    expect(exported.getFrameworkVersion).toBeInstanceOf(Function);
    expect(exported.getReactVersion).toBeInstanceOf(Function);
    expect(exported.getVueVersion).toBeInstanceOf(Function);
  });
  it('should export all capability detection functions', () => {
    expect(exported.detectCapabilities).toBeInstanceOf(Function);
    expect(exported.hasAudio).toBeInstanceOf(Function);
    expect(exported.hasCamera).toBeInstanceOf(Function);
    expect(exported.hasCanvas).toBeInstanceOf(Function);
    expect(exported.hasCustomElements).toBeInstanceOf(Function);
    expect(exported.hasGeolocation).toBeInstanceOf(Function);
    expect(exported.hasIndexedDB).toBeInstanceOf(Function);
    expect(exported.hasLocalStorage).toBeInstanceOf(Function);
    expect(exported.hasMicrophone).toBeInstanceOf(Function);
    expect(exported.hasModules).toBeInstanceOf(Function);
    expect(exported.hasNotification).toBeInstanceOf(Function);
    expect(exported.hasServiceWorker).toBeInstanceOf(Function);
    expect(exported.hasShadowDOM).toBeInstanceOf(Function);
  });
  it('should export cache utilities', () => {
    expect(exported.clearCache).toBeInstanceOf(Function);
    expect(exported.getCached).toBeInstanceOf(Function);
    expect(exported.setCached).toBeInstanceOf(Function);
  });
});
