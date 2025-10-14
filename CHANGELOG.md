# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-01-XX

### Added

#### Platform Detection
- Detect runtime platforms: `web`, `node`, `react-native`, `electron`, `capacitor`, `cordova`, `nw.js`, `webworker`, `serviceworker`
- Detect browsers: Chrome, Firefox, Safari, Edge, Opera, IE, Samsung Internet, Chromium
- Detect operating systems: Windows, macOS, Linux, ChromeOS, iOS, Android
- Detect runtime types: `browser`, `node`, `worker`, `mobile-native`, `desktop-native`
- Browser version detection
- OS version detection
- Mobile device detection
- Platform-specific checks: `isBrowser()`, `isNode()`, `isReactNative()`, `isElectron()`, etc.

#### Framework Detection
- Detect JavaScript/TypeScript frameworks: React, Vue, Angular, Svelte, Solid, Preact, Lit
- Detect meta-frameworks: Next.js, Nuxt.js, Gatsby, Remix
- Flutter WebView detection
- Framework version detection (React, Vue, Angular)
- SSR (Server-Side Rendering) detection
- Web Components support detection
- ES Modules support detection
- Helper functions: `shouldUseWebComponents()`, `shouldUseReactWrapper()`, `shouldUseReactNative()`

#### Capability Detection
- Web Components support
- Shadow DOM support
- Custom Elements support
- ES Modules support
- Service Worker support
- Web Worker support
- IndexedDB support
- localStorage support
- sessionStorage support
- WebSocket support
- WebGL and WebGL2 support
- Canvas support
- Audio support
- Video support
- Geolocation support
- Notification support
- Camera/getUserMedia support
- Microphone support

#### Core Features
- Complete detection API with `detect()` function
- Individual detection functions: `detectPlatform()`, `detectFramework()`, `detectCapabilities()`
- Result caching for optimal performance
- Custom detection function support
- Debug utilities: `debug()`, `getSummary()`
- Cache management: `reset()`, `clearCache()`
- TypeScript-first with comprehensive type definitions
- Zero dependencies
- Tree-shakeable exports
- Both ESM and CJS support
- Comprehensive test suite
- Full API documentation

#### Configuration
- Detection options with caching control
- Deep framework detection mode
- Custom detection overrides
- Capability detection toggle

### Documentation
- Complete README with usage examples
- API reference documentation
- TypeScript type exports
- Contributing guidelines
- MIT License
- Example code for all features

## Release Notes

### 1.0.0 - Initial Release

This is the first stable release of @kitiumai/detector, a universal platform and framework detection library for JavaScript/TypeScript applications.

**Highlights:**
- 🎯 Universal detection across all platforms and frameworks
- 🚀 Zero dependencies and lightweight (~5KB gzipped)
- 💪 TypeScript-first with full type safety
- ⚡ Fast with intelligent caching
- 🌳 Tree-shakeable for optimal bundle size
- ✅ Comprehensive test coverage
- 📚 Complete documentation

**Use Cases:**
- Universal component libraries that need to adapt to different platforms
- Analytics and telemetry tools
- Feature detection and progressive enhancement
- Framework-agnostic tooling
- Platform-specific optimizations

**Getting Started:**
```bash
npm install @kitiumai/detector
```

```typescript
import { detect } from '@kitiumai/detector';

const result = detect();
console.log(result.platform.platform);  // 'web' | 'node' | 'react-native' | ...
console.log(result.framework.framework); // 'react' | 'vue' | 'angular' | ...
```

See the [README](README.md) for complete documentation and examples.

---

[Unreleased]: https://github.com/kitium-ai/detector/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/kitium-ai/detector/releases/tag/v1.0.0
