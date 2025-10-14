/**
 * @kitium/detector - Type Definitions
 * Universal platform and framework detection for JavaScript/TypeScript applications
 */

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
  os?: {
    name: DesktopOSType | MobileOSType;
    version?: string;
  };
  browser?: {
    name: BrowserType;
    version?: string;
  };
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
 * Complete detection result combining all detection types
 */
export interface DetectionResult {
  platform: PlatformDetectionResult;
  framework: FrameworkDetectionResult;
  capabilities: CapabilityDetectionResult;
  timestamp: number;
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
   * Custom detection functions
   */
  custom?: {
    platform?: () => Partial<PlatformDetectionResult>;
    framework?: () => Partial<FrameworkDetectionResult>;
  };
}
