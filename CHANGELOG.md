# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-01-XX

### Added

#### User-Agent Client Hints API Support (High Priority)
- Modern, privacy-friendly browser detection using User-Agent Client Hints API
- Automatic fallback to User-Agent string parsing when Client Hints unavailable
- Low-entropy and high-entropy value support
- `useClientHints` option in `DetectionOptions` (default: `true`)
- New utilities: `supportsClientHints()`, `getClientHintsLowEntropy()`, `getClientHintsHighEntropy()`
- Browser support: Chrome 89+, Edge 89+ (with fallback for other browsers)

#### Confidence Scores (High Priority)
- Detection confidence scores (0-1) for platform and framework detection
- `confidence` field added to `PlatformDetectionResult` and `FrameworkDetectionResult`
- `methods` array tracking detection methods used
- Confidence calculated based on detection method reliability
- Higher confidence for Client Hints (0.95) vs User-Agent parsing (0.8)
- Framework-specific confidence scores based on detection certainty

#### Privacy Features (High Priority)
- Privacy mode for minimal detection (`privacyMode` option)
- Comprehensive privacy documentation (`PRIVACY.md`)
- Privacy-focused detection that avoids User-Agent parsing
- Documentation for GDPR, CCPA compliance
- Best practices guide for privacy-conscious applications

#### Device Information Detection (Medium Priority)
- Device type detection: `mobile`, `tablet`, `desktop`, `tv`
- Screen information: width, height, pixel ratio
- Touch support detection
- Screen orientation detection (portrait/landscape)
- `deviceInfo` option in `DetectionOptions`
- New utility: `detectDeviceInfo()`
- New type: `DeviceInfo`

#### Localization Information (Medium Priority)
- Language and languages array detection
- Timezone detection using Intl API
- Locale information
- `localization` option in `DetectionOptions`
- New utility: `detectLocalizationInfo()`
- New type: `LocalizationInfo`

#### Async Detection (Medium Priority)
- Async detection function `detectAsync()` for permission-based features
- Permission-based capability detection:
  - `hasCameraAsync()` - Camera permission check
  - `hasMicrophoneAsync()` - Microphone permission check
  - `hasGeolocationAsync()` - Geolocation permission check
  - `hasNotificationAsync()` - Notification permission check
  - `detectCapabilitiesAsync()` - All async capabilities
- Graceful handling of permission denials
- Enhanced capability detection with permission status
- New type: `AsyncCapabilityResult`

#### Testing Utilities (Medium Priority)
- Mock detection results for testing: `mockDetection()`, `clearMockDetection()`, `getMockDetection()`
- Detection validation: `validateDetection()` with error reporting
- Detection comparison: `compareDetections()` with detailed diff
- Detection equality checking: `areDetectionsEqual()`
- New type: `DetectionDiff` for comparison results

#### Enhanced Detection Results
- `privacyMode` flag in `DetectionResult` indicating privacy mode usage
- `clientHintsUsed` flag in `DetectionResult` indicating Client Hints API usage
- Enhanced platform detection with device and localization info
- Improved framework detection with confidence scores

### Changed

#### Detection Options
- Added `useClientHints?: boolean` option (default: `true`)
- Added `deviceInfo?: boolean` option (default: `false`)
- Added `localization?: boolean` option (default: `false`)
- Added `privacyMode?: boolean` option (default: `false`)

#### Type Definitions
- `PlatformDetectionResult` now includes:
  - `confidence: number` (0-1)
  - `methods: string[]` (detection methods used)
  - `device?: DeviceInfo` (optional device information)
  - `localization?: LocalizationInfo` (optional localization information)
- `FrameworkDetectionResult` now includes:
  - `confidence: number` (0-1)
  - `methods: string[]` (detection methods used)
- `DetectionResult` now includes:
  - `privacyMode?: boolean`
  - `clientHintsUsed?: boolean`

#### Platform Detection
- `detectPlatformInfo()` now accepts options object with Client Hints, device info, localization, and privacy mode
- Enhanced browser detection with Client Hints API support
- Improved confidence scoring based on detection method

#### Framework Detection
- Enhanced framework detection with confidence scores
- Method tracking for framework detection
- Improved detection reliability indicators

### Documentation
- Added comprehensive `PRIVACY.md` documentation
- Privacy best practices guide
- Compliance information (GDPR, CCPA)
- Usage examples for new features
- Client Hints API documentation
- Async detection examples

### Performance
- Client Hints API provides faster, more reliable detection
- Privacy mode reduces detection overhead
- Caching remains efficient with new features

### Security
- Privacy mode reduces fingerprinting surface
- Client Hints API is more privacy-friendly than User-Agent strings
- No external dependencies (maintains zero dependencies)

### Migration Guide

#### Backward Compatibility
All changes are **backward compatible**. Existing code continues to work without modifications.

#### Opt-in New Features
New features are opt-in and don't affect existing functionality:

```typescript
// Old code still works
const result = detect();

// New features are opt-in
const result = detect({
  useClientHints: true,
  deviceInfo: true,
  localization: true,
});
```

#### Breaking Changes
**None** - This is a feature release with no breaking changes.

### Upgrade Notes
- No code changes required for existing users
- New features available when needed
- Client Hints API used automatically when available (with fallback)
- Privacy mode available for privacy-conscious applications

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

## Release Notes

### 2.0.0 - Major Feature Release

This release adds significant new features based on big tech standards and industry best practices, including User-Agent Client Hints API support, confidence scores, privacy features, device information, async detection, and comprehensive testing utilities.

**Highlights:**
- 🔒 **Privacy-First**: User-Agent Client Hints API support and privacy mode
- 📊 **Confidence Scores**: Detection reliability indicators
- 📱 **Device Information**: Screen size, device type, touch support
- 🌍 **Localization**: Language, timezone, locale detection
- ⚡ **Async Detection**: Permission-based feature detection
- 🧪 **Testing Utilities**: Mock, validate, and compare detection results
- 📚 **Privacy Documentation**: Comprehensive privacy guide

**New Features:**
- User-Agent Client Hints API (Chrome 89+, Edge 89+)
- Confidence scores for platform and framework detection
- Device information detection (type, screen, touch, orientation)
- Localization information (language, timezone, locale)
- Async detection for permission-based capabilities
- Testing utilities for mocking and validation
- Privacy mode for minimal detection

**Breaking Changes:**
- None - Fully backward compatible

**Migration:**
- No code changes required
- New features are opt-in
- Existing code continues to work

---

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

[Unreleased]: https://github.com/kitium-ai/detector/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/kitium-ai/detector/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/kitium-ai/detector/releases/tag/v1.0.0
