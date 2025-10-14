# @kitiumai/detector

> Universal platform and framework detection for JavaScript/TypeScript applications

[![npm version](https://badge.fury.io/js/%40kitiumai%2Fdetector.svg)](https://www.npmjs.com/package/@kitiumai/detector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

Detect browsers, frameworks, platforms, and capabilities with **zero dependencies**. Works seamlessly across Web, Node.js, React Native, Electron, and more.

## Features

- **Zero Dependencies** - Lightweight and self-contained
- **TypeScript First** - Full type safety with excellent IntelliSense
- **Universal** - Works in browsers, Node.js, workers, React Native, Electron, etc.
- **Comprehensive** - Detects platforms, frameworks, browsers, OS, and capabilities
- **Fast** - Cached detection with minimal overhead
- **Tree-Shakeable** - Import only what you need

## Installation

```bash
npm install @kitiumai/detector
```

```bash
yarn add @kitiumai/detector
```

```bash
pnpm add @kitiumai/detector
```

## Quick Start

```typescript
import { detect } from '@kitiumai/detector';

const result = detect();

console.log(result.platform.platform);  // 'web' | 'node' | 'react-native' | 'electron' ...
console.log(result.framework.framework); // 'react' | 'vue' | 'angular' | 'svelte' ...
console.log(result.capabilities.webComponents); // true | false
```

## Usage

### Complete Detection

```typescript
import { detect } from '@kitium/detector';

const result = detect();

// Platform information
console.log(result.platform.platform);      // Platform type
console.log(result.platform.runtime);       // Runtime environment
console.log(result.platform.os);            // OS information
console.log(result.platform.browser);       // Browser information
console.log(result.platform.isMobile);      // Mobile device check

// Framework information
console.log(result.framework.framework);    // Framework type
console.log(result.framework.version);      // Framework version
console.log(result.framework.isSSR);        // Server-side rendering check

// Capabilities
console.log(result.capabilities.webComponents);  // Web Components support
console.log(result.capabilities.localStorage);   // localStorage support
console.log(result.capabilities.webgl);          // WebGL support
```

### Platform Detection

```typescript
import { detectPlatform, isBrowser, isNode, isReactNative } from '@kitium/detector';

const platform = detectPlatform();

// Quick checks
if (isBrowser()) {
  console.log('Running in browser');
}

if (isNode()) {
  console.log('Running in Node.js');
}

if (isReactNative()) {
  console.log('Running in React Native');
}

// Detailed platform info
console.log(platform.platform);     // 'web' | 'node' | 'react-native' | etc.
console.log(platform.runtime);      // 'browser' | 'node' | 'mobile-native' | etc.
console.log(platform.isServer);     // boolean
console.log(platform.isBrowser);    // boolean
console.log(platform.isMobile);     // boolean
console.log(platform.isNative);     // boolean

// OS detection
if (platform.os) {
  console.log(platform.os.name);    // 'windows' | 'macos' | 'linux' | 'ios' | 'android'
  console.log(platform.os.version); // OS version (if available)
}

// Browser detection
if (platform.browser) {
  console.log(platform.browser.name);    // 'chrome' | 'firefox' | 'safari' | etc.
  console.log(platform.browser.version); // Browser version (if available)
}
```

### Framework Detection

```typescript
import {
  detectFramework,
  isReact,
  isVue,
  isAngular,
  shouldUseWebComponents,
  shouldUseReactWrapper
} from '@kitium/detector';

const framework = detectFramework();

// Quick checks
if (isReact()) {
  console.log('React detected');
}

if (isVue()) {
  console.log('Vue.js detected');
}

if (isAngular()) {
  console.log('Angular detected');
}

// Framework-specific logic
if (shouldUseReactWrapper()) {
  // Use React-specific implementation
}

if (shouldUseWebComponents()) {
  // Use Web Components
}

// Detailed framework info
console.log(framework.framework);           // 'react' | 'vue' | 'angular' | etc.
console.log(framework.version);             // Framework version (if available)
console.log(framework.isSSR);               // Server-side rendering check
console.log(framework.supportsWebComponents); // Web Components support
console.log(framework.supportsESM);         // ES Modules support
```

### Capabilities Detection

```typescript
import { detectCapabilities } from '@kitium/detector';

const caps = detectCapabilities();

// Check specific capabilities
if (caps.webComponents) {
  console.log('Web Components supported');
}

if (caps.localStorage) {
  console.log('localStorage available');
}

if (caps.serviceWorker) {
  console.log('Service Worker supported');
}

// All available capabilities
console.log(caps.webComponents);    // Web Components
console.log(caps.shadowDOM);        // Shadow DOM
console.log(caps.customElements);   // Custom Elements
console.log(caps.modules);          // ES Modules
console.log(caps.serviceWorker);    // Service Worker
console.log(caps.webWorker);        // Web Worker
console.log(caps.indexedDB);        // IndexedDB
console.log(caps.localStorage);     // localStorage
console.log(caps.sessionStorage);   // sessionStorage
console.log(caps.websocket);        // WebSocket
console.log(caps.webgl);            // WebGL
console.log(caps.webgl2);           // WebGL2
console.log(caps.canvas);           // Canvas
console.log(caps.audio);            // Audio
console.log(caps.video);            // Video
console.log(caps.geolocation);      // Geolocation
console.log(caps.notification);     // Notification
console.log(caps.camera);           // Camera
console.log(caps.microphone);       // Microphone
```

### Debugging

```typescript
import { debug, getSummary } from '@kitium/detector';

// Log complete detection to console
debug();

// Get summary as string
const summary = getSummary();
console.log(summary);
// Output:
// Platform: web
// Runtime: browser
// Framework: react v18.2.0
// OS: windows 10
// Browser: chrome 120.0
// Web Components: Yes
// ESM: Yes
```

### Configuration Options

```typescript
import { detect } from '@kitium/detector';

const result = detect({
  // Enable/disable caching (default: true)
  cache: true,

  // Enable/disable capability detection (default: true)
  capabilities: true,

  // Deep framework detection - slower but more accurate (default: false)
  deep: false,

  // Custom detection functions
  custom: {
    platform: () => ({
      // Override platform detection
    }),
    framework: () => ({
      // Override framework detection
    }),
  },
});
```

### Module Exports

The package supports both default and named imports:

```typescript
// Named imports (recommended)
import { detect, detectPlatform, detectFramework } from '@kitium/detector';

// Default import
import detector from '@kitium/detector';
detector.detect();
detector.detectPlatform();
detector.detectFramework();

// Tree-shakeable imports
import { detectPlatform } from '@kitium/detector/platform';
import { detectFramework } from '@kitium/detector/framework';
import { detectCapabilities } from '@kitium/detector/capabilities';
```

## Supported Platforms

### Platforms
- `web` - Web browser
- `node` - Node.js
- `react-native` - React Native
- `electron` - Electron
- `capacitor` - Capacitor
- `cordova` - Cordova/PhoneGap
- `nw.js` - NW.js
- `webworker` - Web Worker
- `serviceworker` - Service Worker

### Frameworks
- `react` - React
- `next` - Next.js
- `gatsby` - Gatsby
- `remix` - Remix
- `vue` - Vue.js
- `nuxt` - Nuxt.js
- `angular` - Angular
- `svelte` - Svelte
- `solid` - Solid.js
- `preact` - Preact
- `lit` - Lit
- `web` - Vanilla JS

### Browsers
- Chrome
- Firefox
- Safari
- Edge
- Opera
- IE
- Samsung Internet
- Chromium

### Operating Systems
- Windows
- macOS
- Linux
- ChromeOS
- iOS
- Android

## API Reference

### Main Functions

#### `detect(options?: DetectionOptions): DetectionResult`
Performs complete detection of platform, framework, and capabilities.

#### `detectPlatform(options?: DetectionOptions): PlatformDetectionResult`
Detects platform information only.

#### `detectFramework(options?: DetectionOptions): FrameworkDetectionResult`
Detects framework information only.

#### `detectCapabilities(): CapabilityDetectionResult`
Detects browser and platform capabilities.

#### `debug(result?: DetectionResult): void`
Logs detection result to console.

#### `getSummary(result?: DetectionResult): string`
Returns a formatted summary string.

#### `reset(): void`
Clears cached detection results.

### Platform Functions

- `isBrowser(): boolean` - Check if running in browser
- `isNode(): boolean` - Check if running in Node.js
- `isReactNative(): boolean` - Check if running in React Native
- `isElectron(): boolean` - Check if running in Electron
- `isCapacitor(): boolean` - Check if running in Capacitor
- `isCordova(): boolean` - Check if running in Cordova
- `isMobile(): boolean` - Check if on mobile device
- `detectBrowser(): BrowserType` - Detect browser type
- `detectMobileOS(): MobileOSType` - Detect mobile OS
- `detectDesktopOS(): DesktopOSType` - Detect desktop OS

### Framework Functions

- `isReact(): boolean` - Check if React is present
- `isVue(): boolean` - Check if Vue is present
- `isAngular(): boolean` - Check if Angular is present
- `isSvelte(): boolean` - Check if Svelte is present
- `isNextJS(): boolean` - Check if Next.js is present
- `isNuxt(): boolean` - Check if Nuxt is present
- `shouldUseWebComponents(): boolean` - Check if Web Components should be used
- `shouldUseReactWrapper(): boolean` - Check if React wrapper should be used
- `shouldUseReactNative(): boolean` - Check if React Native components should be used

### Capability Functions

- `hasWebComponents(): boolean` - Check Web Components support
- `hasLocalStorage(): boolean` - Check localStorage support
- `hasServiceWorker(): boolean` - Check Service Worker support
- `hasWebGL(): boolean` - Check WebGL support
- And many more...

## TypeScript

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  PlatformType,
  FrameworkType,
  BrowserType,
  DetectionResult,
  PlatformDetectionResult,
  FrameworkDetectionResult,
  CapabilityDetectionResult,
} from '@kitium/detector';
```

## Use Cases

### Universal Component Library

```typescript
import { detect } from '@kitium/detector';

function getComponent() {
  const { platform, framework } = detect();

  if (platform.platform === 'react-native') {
    return ReactNativeComponent;
  }

  if (framework.supportsWebComponents) {
    return WebComponent;
  }

  if (framework.framework === 'react') {
    return ReactComponent;
  }

  return VanillaComponent;
}
```

### Conditional Feature Loading

```typescript
import { detectCapabilities } from '@kitium/detector';

const caps = detectCapabilities();

if (caps.webgl2) {
  loadAdvancedGraphics();
} else if (caps.webgl) {
  loadBasicGraphics();
} else {
  loadFallback();
}
```

### Analytics and Telemetry

```typescript
import { detect, getSummary } from '@kitium/detector';

const info = detect();

sendAnalytics({
  platform: info.platform.platform,
  framework: info.framework.framework,
  browser: info.platform.browser?.name,
  os: info.platform.os?.name,
  mobile: info.platform.isMobile,
});
```

### Progressive Enhancement

```typescript
import { detectCapabilities } from '@kitium/detector';

const caps = detectCapabilities();

const features = {
  notifications: caps.notification,
  offline: caps.serviceWorker,
  localStorage: caps.localStorage,
  realtime: caps.websocket,
};

initializeApp(features);
```

## Performance

- **Lightweight**: ~5KB gzipped
- **Fast**: Cached detection with minimal overhead
- **Tree-Shakeable**: Import only what you need
- **Zero Dependencies**: No external dependencies

## Browser Support

- Chrome/Edge: All versions
- Firefox: All versions
- Safari: All versions
- IE: 11+ (limited support)

## License

MIT © Kitium.AI LLP - See [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Related Packages

- [@kitium/ui](https://www.npmjs.com/package/@kitium/ui) - Universal UI Components Library

## Support

- [GitHub Issues](https://github.com/kitium-ai/detector/issues)
- [GitHub Discussions](https://github.com/kitium-ai/detector/discussions)
- [Documentation](https://github.com/kitium-ai/detector#readme)
