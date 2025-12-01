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
} from './types/index.js';
import { getLogger } from '@kitiumai/logger';
import { compact, unique } from '@kitiumai/utils-ts';
import { detectCapabilities } from './detectors/capabilities.js';
import { detectFrameworkInfo } from './detectors/framework.js';
import { detectPlatformInfo } from './detectors/platform.js';
import { clearCache, configureCache, getCached, setCached } from './utils/cache.js';
import {
  createDetectionTimeoutError,
  createPluginExecutionError,
  extractErrorMetadata,
} from './utils/errors.js';

const logger = getLogger();

// Export all types
export type * from './types/index.js';

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
  const startTime = Date.now();

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

  try {
    // Check cache first
    if (cache) {
      const cached = getCached();
      if (cached) {
        audit.push({ step: 'cache-hit', timestamp: Date.now(), detail: 'in-memory' });
        const duration = Date.now() - startTime;
        logger.debug('Detection completed (cached)', { duration });
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

    const duration = Date.now() - startTime;
    logger.debug('Detection completed', {
      duration,
      platform: result.platform.platform,
      framework: result.framework.framework,
      capabilities: detectCaps,
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const caughtError = error instanceof Error ? error : new Error(String(error));

    logger.error('Detection failed', { duration, error: caughtError.message }, caughtError);
    throw caughtError;
  }
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
    const startTime = Date.now();

    try {
      const next = plugin.apply(acc, context);
      const duration = Date.now() - startTime;

      logger.debug(`Plugin executed: ${plugin.name}@${plugin.version}`, { duration });

      const auditEntry: AuditEntry = {
        step: 'plugin',
        detail: `${plugin.name}@${plugin.version}`,
        timestamp: Date.now(),
      };
      return {
        ...next,
        audit: [...(next.audit || []), auditEntry],
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const pluginError = createPluginExecutionError(
        plugin.name,
        error instanceof Error ? error.message : String(error),
        { duration, version: plugin.version }
      );

      const errorMetadata = extractErrorMetadata(pluginError);
      logger.warn(`Plugin execution failed: ${plugin.name}@${plugin.version}`, {
        ...errorMetadata,
        duration,
      });

      // Continue with unmodified result on plugin error
      const auditEntry: AuditEntry = {
        step: 'plugin-error',
        detail: `${plugin.name}@${plugin.version}: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: Date.now(),
      };
      return {
        ...acc,
        audit: [...(acc.audit || []), auditEntry],
      };
    }
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
    const startTime = Date.now();
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
      const duration = Date.now() - startTime;

      // Clean and deduplicate audit methods using utility functions
      const auditMethods = compact(unique([...(result.audit || []).map((a) => a.detail)]));

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

      logger.debug('Sync detection completed', {
        duration,
        correlationId,
        preset,
        methods: auditMethods,
      });

      hooks.onDetectSuccess?.({ ...event, result: enriched });
      return enriched;
    } catch (error) {
      const duration = Date.now() - startTime;
      const caughtError = error instanceof Error ? error : new Error(String(error));

      logger.error('Sync detection failed', {
        duration,
        correlationId,
        error: caughtError.message,
      });

      hooks.onDetectError?.({ ...event, error });
      throw error;
    }
  };

  const runAsyncDetection = async (
    options: Partial<DetectionOptions> & { correlationId?: string } = {}
  ): Promise<DetectionResult> => {
    const startTime = Date.now();
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
            new Promise<DetectionResult>((resolve) => {
              const timeoutHandle = setTimeout(() => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= config.latencyBudgetMs!) {
                  const timeoutError = createDetectionTimeoutError(
                    'detectAsync',
                    config.latencyBudgetMs!
                  );
                  const errorMetadata = extractErrorMetadata(timeoutError);
                  logger.warn('Detection latency budget exceeded', {
                    ...errorMetadata,
                    elapsed,
                    budget: config.latencyBudgetMs,
                  });
                }
                resolve(fallbackDetection(mergedOptions));
              }, config.latencyBudgetMs);

              // Allow garbage collection
              (timeoutHandle as any).unref?.();
            }),
          ])
        : await runner;

      const duration = Date.now() - startTime;

      // Clean and deduplicate audit methods using utility functions
      const auditMethods = compact(unique([...(result.audit || []).map((a) => a.detail)]));

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

      logger.debug('Async detection completed', {
        duration,
        correlationId,
        preset,
        methods: auditMethods,
      });

      hooks.onDetectSuccess?.({ ...event, result: enriched });
      return enriched;
    } catch (error) {
      const duration = Date.now() - startTime;
      const caughtError = error instanceof Error ? error : new Error(String(error));

      logger.error('Async detection failed', {
        duration,
        correlationId,
        error: caughtError.message,
      });

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
