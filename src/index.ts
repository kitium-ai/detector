/**
 * @kitium/detector
 * Universal platform and framework detection for JavaScript/TypeScript applications
 *
 * @example
 * ```typescript
 * import { detect, detectPlatform, detectFramework } from '@kitium/detector';
 *
 * // Complete detection
 * const result = detect();
 * console.log(result.platform.platform); // 'web'
 * console.log(result.framework.framework); // 'react'
 * console.log(result.capabilities.webComponents); // true
 *
 * // Individual detection
 * const platform = detectPlatform();
 * const framework = detectFramework();
 * ```
 */

import type {
  CapabilityDetectionResult,
  DetectionOptions,
  DetectionResult,
  FrameworkDetectionResult,
  PlatformDetectionResult,
} from './types';
import { detectCapabilities } from './detectors/capabilities';
import {
  detectFrameworkInfo,
} from './detectors/framework';
import {
  detectPlatformInfo,
} from './detectors/platform';
import { clearCache, getCached, setCached } from './utils/cache';

// Export all types
export type * from './types';

// Export platform detection functions
export {
  detectBrowser,
  detectDesktopOS,
  detectMobileOS,
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
} from './detectors/platform';

// Export framework detection functions
export {
  detectFrameworkInfo,
  getAngularVersion,
  getFrameworkVersion,
  getReactVersion,
  getVueVersion,
  isAngular,
  isFlutter,
  isGatsby,
  isLit,
  isNextJS,
  isNuxt,
  isPreact,
  isReact,
  isRemix,
  isServerSide,
  isSolid,
  isSvelte,
  isVue,
  shouldUseReactNative,
  shouldUseReactWrapper,
  shouldUseWebComponents,
} from './detectors/framework';

// Export capability detection functions
export {
  detectCapabilities,
  hasAudio,
  hasCamera,
  hasCanvas,
  hasCustomElements,
  hasGeolocation,
  hasIndexedDB,
  hasLocalStorage,
  hasMicrophone,
  hasModules,
  hasNotification,
  hasServiceWorker,
  hasShadowDOM,
  hasSessionStorage,
  hasVideo,
  hasWebComponents,
  hasWebGL,
  hasWebGL2,
  hasWebSocket,
  hasWebWorker,
} from './detectors/capabilities';

// Export cache utilities
export { clearCache, getCached, setCached } from './utils/cache';

/**
 * Perform complete detection of platform, framework, and capabilities
 */
export function detect(options: DetectionOptions = {}): DetectionResult {
  const {
    cache = true,
    capabilities: detectCaps = true,
    custom,
  } = options;

  // Check cache first
  if (cache) {
    const cached = getCached();
    if (cached) {
      return cached;
    }
  }

  // Detect platform
  let platform = detectPlatformInfo();
  if (custom?.platform) {
    platform = { ...platform, ...custom.platform() };
  }

  // Detect framework
  let framework = detectFrameworkInfo();
  if (custom?.framework) {
    framework = { ...framework, ...custom.framework() };
  }

  // Detect capabilities
  const capabilitiesResult: CapabilityDetectionResult = detectCaps
    ? detectCapabilities()
    : {
        webComponents: false,
        shadowDOM: false,
        customElements: false,
        modules: false,
        serviceWorker: false,
        webWorker: false,
        indexedDB: false,
        localStorage: false,
        sessionStorage: false,
        websocket: false,
        webgl: false,
        webgl2: false,
        canvas: false,
        audio: false,
        video: false,
        geolocation: false,
        notification: false,
        camera: false,
        microphone: false,
      };

  const result: DetectionResult = {
    platform,
    framework,
    capabilities: capabilitiesResult,
    timestamp: Date.now(),
  };

  // Cache result
  if (cache) {
    setCached(result);
  }

  return result;
}

/**
 * Detect platform only
 */
export function detectPlatform(options: DetectionOptions = {}): PlatformDetectionResult {
  const { custom } = options;

  let platform = detectPlatformInfo();
  if (custom?.platform) {
    platform = { ...platform, ...custom.platform() };
  }

  return platform;
}

/**
 * Detect framework only
 */
export function detectFramework(options: DetectionOptions = {}): FrameworkDetectionResult {
  const { custom } = options;

  let framework = detectFrameworkInfo();
  if (custom?.framework) {
    framework = { ...framework, ...custom.framework() };
  }

  return framework;
}

/**
 * Detect capabilities only
 */
export function detectCapabilitiesOnly(): CapabilityDetectionResult {
  return detectCapabilities();
}

/**
 * Get a summary string of the detection
 */
export function getSummary(result?: DetectionResult): string {
  const detection = result || detect();

  const lines = [
    `Platform: ${detection.platform.platform}`,
    `Runtime: ${detection.platform.runtime}`,
    `Framework: ${detection.framework.framework}${
      detection.framework.version ? ` v${detection.framework.version}` : ''
    }`,
  ];

  if (detection.platform.os) {
    lines.push(
      `OS: ${detection.platform.os.name}${
        detection.platform.os.version ? ` ${detection.platform.os.version}` : ''
      }`
    );
  }

  if (detection.platform.browser) {
    lines.push(
      `Browser: ${detection.platform.browser.name}${
        detection.platform.browser.version
          ? ` ${detection.platform.browser.version}`
          : ''
      }`
    );
  }

  lines.push(`Web Components: ${detection.capabilities.webComponents ? 'Yes' : 'No'}`);
  lines.push(`ESM: ${detection.framework.supportsESM ? 'Yes' : 'No'}`);

  return lines.join('\n');
}

/**
 * Log detection result to console
 */
export function debug(result?: DetectionResult): void {
  const detection = result || detect();

  console.group('🔍 Kitium Detector');
  console.log(getSummary(detection));
  console.log('\nFull Result:', detection);
  console.groupEnd();
}

/**
 * Reset all cached detection results
 */
export function reset(): void {
  clearCache();
}
