/**
 * Platform Detection Module
 * Detects the runtime platform, OS, and browser
 */

import type {
  BrowserType,
  DesktopOSType,
  MobileOSType,
  PlatformDetectionResult,
  PlatformType,
  RuntimeType,
} from '../types';
import {
  type ClientHintsData,
  getClientHintsLowEntropy,
  getBrowserFromClientHints,
} from '../utils/client-hints';
import { detectDeviceInfo } from '../utils/device';
import { detectLocalizationInfo } from '../utils/localization';

/**
 * Detect if running in Node.js
 */
export function isNode(): boolean {
  // Treat jsdom and test environments as browser, not Node
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return false;
  }
  if (
    typeof navigator !== 'undefined' &&
    navigator.userAgent &&
    navigator.userAgent.includes('jsdom')
  ) {
    return false;
  }
  return (
    typeof process !== 'undefined' && process.versions !== null && process.versions.node !== null
  );
}

/**
 * Detect if running in a browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Detect if running in React Native
 */
export function isReactNative(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.product === 'string' &&
    navigator.product === 'ReactNative'
  );
}

/**
 * Detect if running in Electron
 */
export function isElectron(): boolean {
  if (!isBrowser()) {
    return false;
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const win = window as unknown as Record<string, unknown>;
  const proc = win['process'] as { type?: unknown } | undefined;
  return userAgent.includes('electron') || !!proc?.type || !!win['electron'];
}

/**
 * Detect if running in Capacitor
 */
export function isCapacitor(): boolean {
  return !!(window as unknown as Record<string, unknown>)['Capacitor'];
}

/**
 * Detect if running in Cordova
 */
export function isCordova(): boolean {
  return !!(window as unknown as Record<string, unknown>)['cordova'];
}

/**
 * Detect if running in NW.js
 */
export function isNwjs(): boolean {
  const win = window as unknown as Record<string, unknown>;
  const req = win['require'] as ((mod: string) => unknown) | undefined;
  return !!win['nw'] || !!req?.('nw.gui');
}

/**
 * Detect if running in Web Worker
 */
export function isWebWorker(): boolean {
  const selfScope = self as unknown as Record<string, unknown>;
  return (
    typeof self !== 'undefined' &&
    typeof selfScope['importScripts'] === 'function' &&
    (selfScope['constructor'] as { name?: string } | undefined)?.name ===
      'DedicatedWorkerGlobalScope'
  );
}

/**
 * Detect if running in Service Worker
 */
export function isServiceWorker(): boolean {
  const selfScope = self as unknown as Record<string, unknown>;
  return (
    typeof self !== 'undefined' &&
    (selfScope['constructor'] as { name?: string } | undefined)?.name === 'ServiceWorkerGlobalScope'
  );
}

/**
 * Detect browser type
 */
export function detectBrowser(userAgentOverride?: string): BrowserType {
  if (!isBrowser()) {
    return 'unknown';
  }

  const userAgent = (userAgentOverride || navigator.userAgent).toLowerCase();

  if (userAgent.includes('edg/')) {
    return 'edge';
  }
  if (userAgent.includes('opr/') || userAgent.includes('opera')) {
    return 'opera';
  }
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    return 'chrome';
  }
  if (userAgent.includes('firefox')) {
    return 'firefox';
  }
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return 'safari';
  }
  if (userAgent.includes('samsungbrowser')) {
    return 'samsung';
  }
  if (userAgent.includes('trident') || userAgent.includes('msie')) {
    return 'ie';
  }
  if (userAgent.includes('chromium')) {
    return 'chromium';
  }

  return 'unknown';
}

/**
 * Get browser version
 */
export function getBrowserVersion(userAgentOverride?: string): string | undefined {
  if (!isBrowser()) {
    return undefined;
  }

  const userAgent = userAgentOverride || navigator.userAgent;
  const browser = detectBrowser(userAgentOverride);

  const patterns: Record<BrowserType, RegExp> = {
    chrome: /Chrome\/(\d+\.\d+)/,
    firefox: /Firefox\/(\d+\.\d+)/,
    safari: /Version\/(\d+\.\d+)/,
    edge: /Edg\/(\d+\.\d+)/,
    opera: /OPR\/(\d+\.\d+)/,
    ie: /(?:MSIE |rv:)(\d+\.\d+)/,
    samsung: /SamsungBrowser\/(\d+\.\d+)/,
    chromium: /Chromium\/(\d+\.\d+)/,
    unknown: /(?:)/,
  };

  const pattern = patterns[browser];
  const match = userAgent.match(pattern);

  return match?.[1];
}

/**
 * Detect if mobile device
 */
export function isMobile(): boolean {
  if (!isBrowser()) {
    return isReactNative() || isCapacitor() || isCordova();
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const nav = navigator as unknown as { platform?: string; maxTouchPoints?: number };
  return (
    /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
    (nav.platform === 'MacIntel' && (nav.maxTouchPoints ?? 0) > 1)
  );
}

/**
 * Detect mobile OS
 */
export function detectMobileOS(): MobileOSType {
  if (!isBrowser() && !isReactNative()) {
    return 'unknown';
  }

  const userAgent = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return 'ios';
  }
  if (/android/i.test(userAgent)) {
    return 'android';
  }

  return 'unknown';
}

/**
 * Detect desktop OS
 */
export function detectDesktopOS(): DesktopOSType {
  if (isNode()) {
    const platform = process.platform;
    if (platform === 'win32') {
      return 'windows';
    }
    if (platform === 'darwin') {
      return 'macos';
    }
    if (platform === 'linux') {
      return 'linux';
    }
  }

  if (!isBrowser()) {
    return 'unknown';
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const nav = navigator as unknown as { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform?.toLowerCase() || navigator.platform.toLowerCase();

  if (platform.includes('win')) {
    return 'windows';
  }
  if (platform.includes('mac')) {
    return 'macos';
  }
  if (platform.includes('linux')) {
    return 'linux';
  }
  if (userAgent.includes('cros')) {
    return 'chromeos';
  }

  return 'unknown';
}

/**
 * Get OS version
 */
export function getOSVersion(): string | undefined {
  if (!isBrowser()) {
    return undefined;
  }

  const userAgent = navigator.userAgent;

  // iOS version
  const iosMatch = userAgent.match(/OS (\d+)[._](\d+)[._]?(\d+)?/);
  if (iosMatch) {
    return `${iosMatch[1]}.${iosMatch[2]}${iosMatch[3] ? `.${iosMatch[3]}` : ''}`;
  }

  // Android version
  const androidMatch = userAgent.match(/Android (\d+(?:\.\d+)*)/);
  if (androidMatch) {
    return androidMatch[1];
  }

  // Windows version
  const windowsMatch = userAgent.match(/Windows NT (\d+\.\d+)/);
  if (windowsMatch) {
    const versionMap: Record<string, string> = {
      '10.0': '10',
      '6.3': '8.1',
      '6.2': '8',
      '6.1': '7',
      '6.0': 'Vista',
      '5.1': 'XP',
    };
    const winKey = windowsMatch[1];
    if (winKey && versionMap[winKey]) {
      return versionMap[winKey];
    } else if (winKey) {
      return winKey;
    }
  }

  // macOS version
  const macMatch = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
  if (macMatch && macMatch[1]) {
    return macMatch[1].replace(/_/g, '.');
  }

  return undefined;
}

/**
 * Detect platform type
 */
export function detectPlatform(): PlatformType {
  if (isServiceWorker()) {
    return 'serviceworker';
  }
  if (isWebWorker()) {
    return 'webworker';
  }
  if (isReactNative()) {
    return 'react-native';
  }
  if (isElectron()) {
    return 'electron';
  }
  if (isCapacitor()) {
    return 'capacitor';
  }
  if (isCordova()) {
    return 'cordova';
  }
  if (isNwjs()) {
    return 'nw.js';
  }
  if (isNode()) {
    return 'node';
  }
  if (isBrowser()) {
    return 'web';
  }

  return 'unknown';
}

/**
 * Detect runtime type
 */
export function detectRuntime(): RuntimeType {
  if (isServiceWorker() || isWebWorker()) {
    return 'worker';
  }
  if (isReactNative() || isCapacitor() || isCordova()) {
    return 'mobile-native';
  }
  if (isElectron() || isNwjs()) {
    return 'desktop-native';
  }
  if (isNode()) {
    return 'node';
  }
  if (isBrowser()) {
    return 'browser';
  }

  return 'unknown';
}

/**
 * Complete platform detection with confidence scores
 */
export function detectPlatformInfo(
  options: {
    useClientHints?: boolean;
    deviceInfo?: boolean;
    localization?: boolean;
    privacyMode?: boolean;
    clientHintsData?: ClientHintsData;
    userAgent?: string;
    platformOverrides?: Partial<PlatformDetectionResult>;
  } = {}
): PlatformDetectionResult {
  const {
    useClientHints = true,
    deviceInfo = false,
    localization = false,
    privacyMode = false,
    clientHintsData,
    userAgent,
    platformOverrides,
  } = options;

  const methods: string[] = [];
  let confidence = 1.0;

  const platform = detectPlatform();
  const runtime = detectRuntime();
  const mobile = isMobile();
  const server = isNode();
  const browser = isBrowser();

  methods.push('platform-detection');
  methods.push('runtime-detection');

  // Use User-Agent Client Hints if available and enabled
  let browserInfo: { name: BrowserType; version?: string } | undefined;

  if (browser && !privacyMode) {
    if (useClientHints) {
      try {
        const clientHints = clientHintsData || getClientHintsLowEntropy();
        if (clientHints) {
          const hintsBrowser = getBrowserFromClientHints(clientHints);
          if (hintsBrowser) {
            browserInfo = {
              name: hintsBrowser.name as BrowserType,
              version: hintsBrowser.version,
            };
            methods.push(clientHintsData ? 'client-hints-injected' : 'client-hints');
            confidence = 0.95; // Client Hints is more reliable
          }
        }
      } catch {
        // Client Hints not available, fallback to User-Agent
      }
    }

    // Fallback to User-Agent parsing if Client Hints not used
    if (!browserInfo) {
      browserInfo = {
        name: detectBrowser(userAgent),
        version: getBrowserVersion(userAgent),
      };
      methods.push('user-agent-parsing');
      confidence = 0.8; // User-Agent parsing is less reliable
    }
  }

  const result: PlatformDetectionResult = {
    platform,
    runtime,
    isServer: server,
    isBrowser: browser,
    isMobile: mobile,
    isDesktop: !mobile && browser,
    isNative: runtime === 'mobile-native' || runtime === 'desktop-native',
    confidence,
    methods,
  };

  // OS detection
  if (!privacyMode) {
    if (mobile) {
      result.os = {
        name: detectMobileOS(),
        version: getOSVersion(),
      };
      methods.push('mobile-os-detection');
    } else {
      result.os = {
        name: detectDesktopOS(),
        version: getOSVersion(),
      };
      methods.push('desktop-os-detection');
    }
  }

  if (browserInfo) {
    result.browser = browserInfo;
  }

  // Device information
  if (deviceInfo && browser) {
    try {
      result.device = detectDeviceInfo();
      methods.push('device-detection');
    } catch {
      // Device detection failed
    }
  }

  // Localization information
  if (localization && browser) {
    try {
      result.localization = detectLocalizationInfo();
      methods.push('localization-detection');
    } catch {
      // Localization detection failed
    }
  }

  if (platformOverrides) {
    return {
      ...result,
      ...platformOverrides,
      methods: Array.from(new Set([...result.methods, ...(platformOverrides.methods || [])])),
    };
  }

  return result;
}
