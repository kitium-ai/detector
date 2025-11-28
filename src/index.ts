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
  AuditEntry,
  CapabilityDetectionResult,
  ClientHintsStrategy,
  DetectionOptions,
  DetectionResult,
  DetectorClient,
  DetectorConfig,
  DetectorEvent,
  DetectorPreset,
  FrameworkDetectionResult,
  PlatformDetectionResult,
  PrivacyModeSetting,
} from './types';
import { getLogger } from '@kitiumai/logger';
import { detectCapabilities } from './detectors/capabilities';
import { detectFrameworkInfo } from './detectors/framework';
import { detectPlatformInfo } from './detectors/platform';
import { clearCache, configureCache, getCached, setCached } from './utils/cache';

const logger = getLogger();
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
export { clearCache, configureCache, getCached, setCached } from './utils/cache';

// Export async detection
export {
  detectCapabilitiesAsync,
  hasCameraAsync,
  hasGeolocationAsync,
  hasMicrophoneAsync,
  hasNotificationAsync,
} from './detectors/capabilities-async';
export type { AsyncCapabilityResult } from './detectors/capabilities-async';

// Export testing utilities
export {
  mockDetection,
  clearMockDetection,
  getMockDetection,
  validateDetection,
  compareDetections,
  areDetectionsEqual,
} from './utils/testing';
export type { DetectionDiff } from './utils/testing';

// Export Client Hints utilities
export {
  supportsClientHints,
  getClientHintsLowEntropy,
  getClientHintsHighEntropy,
  getBrowserFromClientHints,
} from './utils/client-hints';
export type { ClientHintsData } from './utils/client-hints';

// Export device utilities
export { detectDeviceInfo } from './utils/device';

// Export localization utilities
export { detectLocalizationInfo } from './utils/localization';

// Logger is initialized in cache module for detection caching

/**
 * Perform complete detection of platform, framework, and capabilities
 */
export function detect(options: DetectionOptions = {}): DetectionResult {
  const {
    cache = true,
    capabilities: detectCaps = true,
    useClientHints = true,
    deviceInfo = false,
    localization = false,
    privacyMode = false,
    custom,
    clientHintsData,
    userAgent,
    capabilityOverrides,
    platformOverrides,
    frameworkOverrides,
  } = options;

  const audit: AuditEntry[] = [];
  if (privacyMode) {
    audit.push({ step: 'privacy-mode', timestamp: Date.now(), detail: 'deterministic path' });
  }

  // Check cache first
  if (cache) {
    const cached = getCached();
    if (cached) {
      audit.push({ step: 'cache-hit', timestamp: Date.now(), detail: 'in-memory' });
      return cached;
    }
  }

  // Detect platform with new options
  let platform = detectPlatformInfo({
    useClientHints,
    deviceInfo,
    localization,
    privacyMode,
    clientHintsData,
    userAgent,
    platformOverrides,
  });
  const customPlatform = custom?.platform?.();
  if (customPlatform) {
    platform = {
      ...platform,
      ...customPlatform,
      methods: Array.from(new Set([...platform.methods, ...(customPlatform.methods || [])])),
    };
  }
  audit.push({
    step: 'platform-detection',
    timestamp: Date.now(),
    detail: platform.methods.join(','),
  });

  // Detect framework
  let framework = detectFrameworkInfo();
  const customFramework = custom?.framework?.();
  if (customFramework) {
    framework = { ...framework, ...customFramework };
  }
  if (frameworkOverrides) {
    framework = { ...framework, ...frameworkOverrides };
  }
  audit.push({
    step: 'framework-detection',
    timestamp: Date.now(),
    detail: framework.methods.join(','),
  });

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

  const mergedCapabilities = capabilityOverrides
    ? { ...capabilitiesResult, ...capabilityOverrides }
    : capabilitiesResult;
  audit.push({
    step: 'capabilities-detection',
    timestamp: Date.now(),
    detail: detectCaps ? 'sync' : 'disabled',
  });

  // Check if Client Hints was used
  const clientHintsUsed = platform.methods.includes('client-hints');

  const result: DetectionResult = {
    platform,
    framework,
    capabilities: mergedCapabilities,
    timestamp: Date.now(),
    privacyMode: privacyMode || undefined,
    clientHintsUsed:
      clientHintsUsed || platform.methods.includes('client-hints-injected') || undefined,
    audit,
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
  const { custom, useClientHints, deviceInfo, localization, privacyMode } = options;

  let platform = detectPlatformInfo({
    useClientHints: useClientHints ?? true,
    deviceInfo: deviceInfo ?? false,
    localization: localization ?? false,
    privacyMode: privacyMode ?? false,
  });

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
        detection.platform.browser.version ? ` ${detection.platform.browser.version}` : ''
      }`
    );
  }

  lines.push(`Web Components: ${detection.capabilities.webComponents ? 'Yes' : 'No'}`);
  lines.push(`ESM: ${detection.framework.supportsESM ? 'Yes' : 'No'}`);

  return lines.join('\n');
}

/**
 * Log detection result using logger
 */
export function debug(result?: DetectionResult): void {
  const detection = result || detect();

  logger.info('🔍 Kitium Detector');
  logger.info(getSummary(detection));
  logger.debug('Full Detection Result', { result: detection });
}

/**
 * Reset all cached detection results
 */
export function reset(): void {
  clearCache();
}

/**
 * Async detection with permission-based capabilities
 */
export async function detectAsync(options: DetectionOptions = {}): Promise<DetectionResult> {
  const {
    cache = true,
    capabilities: detectCaps = true,
    useClientHints = true,
    deviceInfo = false,
    localization = false,
    privacyMode = false,
    custom,
    clientHintsData,
    userAgent,
    capabilityOverrides,
    platformOverrides,
    frameworkOverrides,
  } = options;

  const audit: AuditEntry[] = [];
  if (privacyMode) {
    audit.push({ step: 'privacy-mode', timestamp: Date.now(), detail: 'deterministic path' });
  }

  // Check cache first
  if (cache) {
    const cached = getCached();
    if (cached) {
      audit.push({ step: 'cache-hit', timestamp: Date.now(), detail: 'in-memory' });
      return cached;
    }
  }

  // Detect platform with new options
  let platform = detectPlatformInfo({
    useClientHints,
    deviceInfo,
    localization,
    privacyMode,
    clientHintsData,
    userAgent,
    platformOverrides,
  });
  const customPlatform = custom?.platform?.();
  if (customPlatform) {
    platform = {
      ...platform,
      ...customPlatform,
      methods: Array.from(new Set([...platform.methods, ...(customPlatform.methods || [])])),
    };
  }
  audit.push({
    step: 'platform-detection',
    timestamp: Date.now(),
    detail: platform.methods.join(','),
  });

  // Detect framework
  let framework = detectFrameworkInfo();
  const customFramework = custom?.framework?.();
  if (customFramework) {
    framework = { ...framework, ...customFramework };
  }
  if (frameworkOverrides) {
    framework = { ...framework, ...frameworkOverrides };
  }
  audit.push({
    step: 'framework-detection',
    timestamp: Date.now(),
    detail: framework.methods.join(','),
  });

  // Detect capabilities (sync)
  let capabilitiesResult: CapabilityDetectionResult;

  if (detectCaps) {
    const syncCapabilities = detectCapabilities();

    const allowAsync = !privacyMode;

    // Enhance with async capabilities if available and allowed
    if (allowAsync) {
      try {
        const { detectCapabilitiesAsync } = await import('./detectors/capabilities-async');
        const asyncCapabilities = await detectCapabilitiesAsync();

        capabilitiesResult = {
          ...syncCapabilities,
          camera: asyncCapabilities.camera,
          microphone: asyncCapabilities.microphone,
          geolocation: asyncCapabilities.geolocation,
          notification: asyncCapabilities.notification,
        };
      } catch {
        // Async detection failed, use sync only
        capabilitiesResult = syncCapabilities;
      }
    } else {
      capabilitiesResult = syncCapabilities;
    }
  } else {
    capabilitiesResult = {
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
  }

  const mergedCapabilities = capabilityOverrides
    ? { ...capabilitiesResult, ...capabilityOverrides }
    : capabilitiesResult;
  audit.push({
    step: 'capabilities-detection',
    timestamp: Date.now(),
    detail: detectCaps ? (privacyMode ? 'sync (privacy)' : 'sync+async') : 'disabled',
  });

  // Check if Client Hints was used
  const clientHintsUsed = platform.methods.includes('client-hints');

  const result: DetectionResult = {
    platform,
    framework,
    capabilities: mergedCapabilities,
    timestamp: Date.now(),
    privacyMode: privacyMode || undefined,
    clientHintsUsed:
      clientHintsUsed || platform.methods.includes('client-hints-injected') || undefined,
    audit,
  };

  // Cache result
  if (cache) {
    setCached(result);
  }

  return result;
}

const PRESET_OPTIONS: Record<DetectorPreset, Partial<DetectionOptions>> = {
  web: { deviceInfo: true, localization: true, capabilities: true, cache: true },
  ssr: { useClientHints: false, cache: false, localization: false, capabilities: true },
  native: { useClientHints: false, deviceInfo: true, localization: false, capabilities: true },
  test: { cache: false, capabilities: false, localization: false, deviceInfo: false },
};

function resolveClientHints(
  strategy: ClientHintsStrategy,
  runtime?: boolean,
  presetDefault?: boolean
): boolean {
  if (strategy === 'off') {
    return false;
  }
  if (strategy === 'force') {
    return true;
  }
  return runtime ?? presetDefault ?? true;
}

function privacyFlag(mode: PrivacyModeSetting, runtime?: boolean): boolean {
  if (mode === 'strict') {
    return true;
  }
  if (runtime !== undefined) {
    return runtime;
  }
  return mode === 'balanced' ? false : false;
}

function withPlugins(
  result: DetectionResult,
  plugins: DetectorConfig['plugins'],
  context: DetectorEvent
): DetectionResult {
  if (!plugins?.length) {
    return result;
  }

  return plugins.reduce((acc, plugin) => {
    const next = plugin.apply(acc, context);
    const auditEntry: AuditEntry = {
      step: 'plugin',
      detail: `${plugin.name}@${plugin.version}`,
      timestamp: Date.now(),
    };
    return {
      ...next,
      audit: [...(next.audit || []), auditEntry],
    };
  }, result);
}

function fallbackDetection(options: DetectionOptions): DetectionResult {
  return detect({ ...options, capabilities: false, cache: false });
}

export function createDetector(config: DetectorConfig = {}): DetectorClient {
  const preset: DetectorPreset = config.preset ?? 'web';
  const hooks = config.hooks ?? {};
  const privacyModeSetting: PrivacyModeSetting = config.privacyMode ?? 'balanced';
  const clientHintsStrategy: ClientHintsStrategy = config.clientHints ?? 'auto';

  if (config.cacheAdapter || config.cacheTtlMs) {
    configureCache({ adapter: config.cacheAdapter, ttlMs: config.cacheTtlMs });
  }

  const presetDefaults = PRESET_OPTIONS[preset];

  const buildOptions = (options: Partial<DetectionOptions>): DetectionOptions => {
    const basePrivacy = privacyFlag(privacyModeSetting, options.privacyMode);

    const mergedOptions: DetectionOptions = {
      ...presetDefaults,
      ...options,
      privacyMode: basePrivacy,
      useClientHints: resolveClientHints(
        clientHintsStrategy,
        options.useClientHints,
        presetDefaults.useClientHints
      ),
      capabilityOverrides: options.capabilityOverrides ?? config.overrides?.capabilities,
      platformOverrides: options.platformOverrides ?? config.overrides?.platform,
      frameworkOverrides: options.frameworkOverrides ?? config.overrides?.framework,
    };

    if (privacyModeSetting === 'strict') {
      mergedOptions.capabilities = false;
      mergedOptions.useClientHints = false;
    }

    return mergedOptions;
  };

  const runSyncDetection = (
    options: Partial<DetectionOptions> & { correlationId?: string } = {}
  ): DetectionResult => {
    const correlationId =
      options.correlationId || `det-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const mergedOptions = buildOptions(options);

    const event: DetectorEvent = {
      correlationId,
      preset,
      privacyMode: privacyModeSetting,
      timestamp: Date.now(),
    };

    hooks.onDetectStart?.(event);

    try {
      const result = detect(mergedOptions);
      const enriched = withPlugins(
        {
          ...result,
          preset,
          correlationId,
          audit: [
            ...(result.audit || []),
            { step: 'client', timestamp: Date.now(), detail: preset },
          ],
        },
        config.plugins,
        event
      );

      hooks.onDetectSuccess?.({ ...event, result: enriched });
      return enriched;
    } catch (error) {
      hooks.onDetectError?.({ ...event, error });
      throw error;
    }
  };

  const runAsyncDetection = async (
    options: Partial<DetectionOptions> & { correlationId?: string } = {}
  ): Promise<DetectionResult> => {
    const correlationId =
      options.correlationId || `det-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const mergedOptions = buildOptions(options);

    const event: DetectorEvent = {
      correlationId,
      preset,
      privacyMode: privacyModeSetting,
      timestamp: Date.now(),
    };

    hooks.onDetectStart?.(event);

    try {
      const runner = detectAsync(mergedOptions);

      const result = config.latencyBudgetMs
        ? await Promise.race<DetectionResult>([
            runner,
            new Promise<DetectionResult>((resolve) =>
              setTimeout(() => resolve(fallbackDetection(mergedOptions)), config.latencyBudgetMs)
            ),
          ])
        : await runner;

      const enriched = withPlugins(
        {
          ...result,
          preset,
          correlationId,
          audit: [
            ...(result.audit || []),
            { step: 'client', timestamp: Date.now(), detail: preset },
          ],
        },
        config.plugins,
        event
      );

      hooks.onDetectSuccess?.({ ...event, result: enriched });
      return enriched;
    } catch (error) {
      hooks.onDetectError?.({ ...event, error });
      throw error;
    }
  };

  return {
    detect: (options) => runSyncDetection(options),
    detectAsync: (options) => runAsyncDetection(options),
    getSummary,
    reset,
  };
}
