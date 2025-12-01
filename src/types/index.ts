/**
 * @kitium/detector - Type Definitions
 * Universal platform and framework detection for JavaScript/TypeScript applications
 */

import type { ClientHintsData } from '../utils/client-hints';

/**
 * Platform types supported by the detector
 */
export type PlatformType =
  | 'web' // Web browser
  | 'node' // Node.js
  | 'react-native' // React Native
  | 'electron' // Electron
  | 'capacitor' // Capacitor
  | 'cordova' // Cordova/PhoneGap
  | 'nw.js' // NW.js
  | 'webworker' // Web Worker
  | 'serviceworker' // Service Worker
  | 'unknown'; // Unknown platform

/**
 * Framework types supported by the detector
 */
export type FrameworkType =
  | 'react' // React (browser)
  | 'react-native' // React Native (mobile)
  | 'angular' // Angular
  | 'vue' // Vue.js
  | 'svelte' // Svelte
  | 'flutter' // Flutter WebView
  | 'next' // Next.js
  | 'nuxt' // Nuxt.js
  | 'gatsby' // Gatsby
  | 'remix' // Remix
  | 'solid' // Solid.js
  | 'preact' // Preact
  | 'lit' // Lit
  | 'web' // Vanilla JS or unknown framework
  | 'node'; // Node.js (SSR)

/**
 * Runtime environment types
 */
export type RuntimeType =
  | 'browser' // Browser environment
  | 'node' // Node.js environment
  | 'worker' // Web Worker or Service Worker
  | 'mobile-native' // React Native, Capacitor, Cordova
  | 'desktop-native' // Electron, NW.js
  | 'unknown'; // Unknown runtime

/**
 * Browser types
 */
export type BrowserType =
  | 'chrome'
  | 'firefox'
  | 'safari'
  | 'edge'
  | 'opera'
  | 'ie'
  | 'samsung'
  | 'chromium'
  | 'unknown';

/**
 * Mobile OS types
 */
export type MobileOSType = 'ios' | 'android' | 'unknown';

/**
 * Desktop OS types
 */
export type DesktopOSType = 'windows' | 'macos' | 'linux' | 'chromeos' | 'unknown';

/**
 * Device information
 */
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop' | 'tv' | 'unknown';
  screen: {
    width: number;
    height: number;
    pixelRatio: number;
  };
  touch: boolean;
  orientation?: 'portrait' | 'landscape';
}

/**
 * Localization information
 */
export interface LocalizationInfo {
  language: string;
  languages: string[];
  timezone: string;
  locale: string;
}

/**
 * Platform detection result
 */
export interface PlatformDetectionResult {
  platform: PlatformType;
  runtime: RuntimeType;
  isServer: boolean;
  isBrowser: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  isNative: boolean;
  confidence: number; // 0-1, detection confidence
  methods: string[]; // Detection methods used
  os?: {
    name: DesktopOSType | MobileOSType;
    version?: string;
  };
  browser?: {
    name: BrowserType;
    version?: string;
  };
  device?: DeviceInfo;
  localization?: LocalizationInfo;
}

/**
 * Framework detection result
 */
export interface FrameworkDetectionResult {
  framework: FrameworkType;
  version?: string;
  isSSR: boolean;
  supportsWebComponents: boolean;
  supportsESM: boolean;
  confidence: number; // 0-1, detection confidence
  methods: string[]; // Detection methods used
}

/**
 * Capability detection result
 */
export interface CapabilityDetectionResult {
  webComponents: boolean;
  shadowDOM: boolean;
  customElements: boolean;
  modules: boolean;
  serviceWorker: boolean;
  webWorker: boolean;
  indexedDB: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  websocket: boolean;
  webgl: boolean;
  webgl2: boolean;
  canvas: boolean;
  audio: boolean;
  video: boolean;
  geolocation: boolean;
  notification: boolean;
  camera: boolean;
  microphone: boolean;
}

/**
 * Audit entry for deterministic, privacy-aware logging
 */
export interface AuditEntry {
  step: string;
  detail?: string;
  timestamp: number;
}

/**
 * Complete detection result combining all detection types
 */
export interface DetectionResult {
  platform: PlatformDetectionResult;
  framework: FrameworkDetectionResult;
  capabilities: CapabilityDetectionResult;
  timestamp: number;
  privacyMode?: boolean; // Whether privacy mode was used
  clientHintsUsed?: boolean; // Whether User-Agent Client Hints was used
  preset?: DetectorPreset;
  correlationId?: string;
  audit?: AuditEntry[];
}

/**
 * Detection options
 */
export interface DetectionOptions {
  /**
   * Cache detection results
   * @default true
   */
  cache?: boolean;

  /**
   * Perform deep framework detection (slower but more accurate)
   * @default false
   */
  deep?: boolean;

  /**
   * Include capability detection
   * @default true
   */
  capabilities?: boolean;

  /**
   * Use User-Agent Client Hints API when available (modern, privacy-friendly)
   * @default true
   */
  useClientHints?: boolean;

  /**
   * Include device information (screen size, device type, etc.)
   * @default false
   */
  deviceInfo?: boolean;

  /**
   * Include localization information (language, timezone, etc.)
   * @default false
   */
  localization?: boolean;

  /**
   * Privacy mode - minimal detection, no User-Agent parsing
   * @default false
   */
  privacyMode?: boolean;

  /**
   * Custom detection functions
   */
  custom?: {
    platform?: () => Partial<PlatformDetectionResult>;
    framework?: () => Partial<FrameworkDetectionResult>;
  };

  /**
   * Provide sanitized Client Hints data (e.g., from an edge function)
   */
  clientHintsData?: ClientHintsData;

  /**
   * Override the user agent string used for parsing
   */
  userAgent?: string;

  /**
   * Override detected capabilities with pre-fetched values
   */
  capabilityOverrides?: Partial<CapabilityDetectionResult>;

  /**
   * Override platform information with pre-fetched values
   */
  platformOverrides?: Partial<PlatformDetectionResult>;

  /**
   * Override framework information with pre-fetched values
   */
  frameworkOverrides?: Partial<FrameworkDetectionResult>;
}

/**
 * Privacy mode presets
 */
export type PrivacyModeSetting = 'off' | 'balanced' | 'strict';

/**
 * Client hints strategy
 */
export type ClientHintsStrategy = 'auto' | 'force' | 'off';

/**
 * Detector presets for simplified entrypoints
 */
export type DetectorPreset = 'web' | 'ssr' | 'native' | 'test';

/**
 * Runtime hooks for observability
 */
export interface DetectorHooks {
  onDetectStart?: (payload: DetectorEvent) => void;
  onDetectSuccess?: (payload: DetectorEvent & { result: DetectionResult }) => void;
  onDetectError?: (payload: DetectorEvent & { error: unknown }) => void;
}

export interface DetectorEvent {
  correlationId: string;
  preset?: DetectorPreset;
  privacyMode?: PrivacyModeSetting;
  timestamp: number;
}

/**
 * Cache adapter for enterprise deployments
 */
export interface CacheAdapter {
  get(): DetectionResult | null;
  set(data: DetectionResult, ttlMs?: number): void;
  clear(): void;
}

/**
 * Plugin contract for extending detection
 */
export interface DetectorPlugin {
  name: string;
  version: string;
  apply: (result: DetectionResult, context: DetectorEvent) => DetectionResult;
}

/**
 * Error metadata for structured error handling
 */
export interface ErrorMetadata {
  code?: string;
  kind?: string;
  severity?: string;
  statusCode?: number;
  retryable?: boolean;
  help?: string;
  docs?: string;
}

/**
 * Branded type for validated detection context
 */
export type ValidatedDetectionContext = {
  readonly __brand: 'ValidatedDetectionContext';
  correlationId: string;
  preset?: DetectorPreset;
  privacyMode?: PrivacyModeSetting;
  timestamp: number;
};

/**
 * Configuration for the simplified detector client
 */
export interface DetectorConfig {
  preset?: DetectorPreset;
  privacyMode?: PrivacyModeSetting;
  clientHints?: ClientHintsStrategy;
  cacheAdapter?: CacheAdapter;
  cacheTtlMs?: number;
  hooks?: DetectorHooks;
  latencyBudgetMs?: number;
  overrides?: {
    platform?: Partial<PlatformDetectionResult>;
    framework?: Partial<FrameworkDetectionResult>;
    capabilities?: Partial<CapabilityDetectionResult>;
  };
  plugins?: DetectorPlugin[];
}

export interface DetectorClient {
  detect: (options?: Partial<DetectionOptions> & { correlationId?: string }) => DetectionResult;
  detectAsync: (
    options?: Partial<DetectionOptions> & { correlationId?: string }
  ) => Promise<DetectionResult>;
  getSummary: (result?: DetectionResult) => string;
  reset: () => void;
}
