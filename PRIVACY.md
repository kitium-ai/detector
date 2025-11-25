# Privacy & Security

## Overview

The `@kitiumai/detector` package is designed with privacy in mind. This document explains how the package handles user data, what information is collected, and how to use privacy-friendly features.

## What Information is Detected

The detector package can identify:

- **Platform Information**: Browser type, operating system, device type
- **Framework Information**: JavaScript framework (React, Vue, Angular, etc.)
- **Capabilities**: Browser features and APIs available
- **Device Information**: Screen size, device type, touch support (optional)
- **Localization**: Language, timezone, locale (optional)

## Privacy Considerations

### User-Agent String

By default, the package uses the browser's `navigator.userAgent` string to detect platform and browser information. The User-Agent string can reveal:

- Browser type and version
- Operating system
- Device information
- Some privacy-sensitive details

**Privacy Impact**: Medium - User-Agent strings are sent with every HTTP request and can be used for fingerprinting.

### User-Agent Client Hints (Recommended)

The package supports the modern **User-Agent Client Hints API**, which is more privacy-friendly:

- ✅ Only sends data when explicitly requested
- ✅ Granular control over what information is shared
- ✅ Permission-based access model
- ✅ Less fingerprinting potential

**Usage**:
```typescript
import { detect } from '@kitiumai/detector';

// Uses Client Hints when available (default)
const result = detect({ useClientHints: true });
```

**Privacy Impact**: Low - More privacy-friendly, requires explicit permission for detailed information.

### Privacy Mode

For maximum privacy, use **Privacy Mode**:

```typescript
import { detect } from '@kitiumai/detector';

// Minimal detection, no User-Agent parsing
const result = detect({ privacyMode: true });
```

**Privacy Mode**:
- ✅ No User-Agent string parsing
- ✅ No detailed browser/OS detection
- ✅ Only basic platform detection (browser vs. node)
- ✅ Minimal fingerprinting

**Privacy Impact**: Very Low - Only detects essential runtime information.

## Data Collection

### What We Collect

**Nothing.** The detector package:

- ✅ Runs entirely client-side
- ✅ No network requests
- ✅ No data transmission
- ✅ No analytics or tracking
- ✅ No external services

### What You Collect

If you use the detector in your application, you are responsible for:

- How you use the detection results
- Whether you send detection data to your servers
- Compliance with privacy regulations (GDPR, CCPA, etc.)

## Best Practices

### 1. Use Privacy Mode When Possible

```typescript
// For applications that don't need detailed detection
const result = detect({ privacyMode: true });
```

### 2. Use Client Hints API

```typescript
// Prefer modern Client Hints over User-Agent strings
const result = detect({ useClientHints: true });
```

### 3. Cache Detection Results

```typescript
// Cache results to avoid repeated detection
const result = detect({ cache: true });
```

### 4. Only Request What You Need

```typescript
// Don't request device info if you don't need it
const result = detect({
  deviceInfo: false, // Only enable if needed
  localization: false, // Only enable if needed
});
```

### 5. Handle Permissions Gracefully

```typescript
// Use async detection for permission-based features
import { detectAsync } from '@kitiumai/detector';

try {
  const result = await detectAsync();
  // Handle permission-based capabilities
} catch (error) {
  // Handle permission denial gracefully
}
```

## Browser Support

### User-Agent Client Hints

- ✅ Chrome 89+
- ✅ Edge 89+
- ⚠️ Firefox: Not yet supported
- ⚠️ Safari: Not yet supported

The package automatically falls back to User-Agent string parsing when Client Hints is not available.

## Compliance

### GDPR (General Data Protection Regulation)

If you use detection results in a way that identifies users:

- ✅ Inform users about data collection
- ✅ Obtain consent if required
- ✅ Provide opt-out mechanisms
- ✅ Allow data deletion

### CCPA (California Consumer Privacy Act)

If you collect detection data:

- ✅ Disclose data collection practices
- ✅ Provide opt-out options
- ✅ Honor deletion requests

### Other Regulations

Consult with legal counsel to ensure compliance with:
- PIPEDA (Canada)
- LGPD (Brazil)
- Other applicable privacy laws

## Security

### No External Dependencies

The package has **zero dependencies**, reducing security risks:

- ✅ No supply chain vulnerabilities
- ✅ No third-party code execution
- ✅ No network requests

### Client-Side Only

All detection happens in the browser or Node.js environment:

- ✅ No server-side processing required
- ✅ No data leaves the client
- ✅ No external API calls

## Recommendations

### For Maximum Privacy

```typescript
import { detect } from '@kitiumai/detector';

// Use privacy mode for minimal detection
const result = detect({
  privacyMode: true,
  deviceInfo: false,
  localization: false,
  capabilities: false, // If not needed
});
```

### For Balanced Privacy and Functionality

```typescript
import { detect } from '@kitiumai/detector';

// Use Client Hints when available
const result = detect({
  useClientHints: true,
  deviceInfo: false, // Only if needed
  localization: false, // Only if needed
});
```

### For Full Detection (When Privacy is Less Concern)

```typescript
import { detect } from '@kitiumai/detector';

// Full detection with all features
const result = detect({
  useClientHints: true,
  deviceInfo: true,
  localization: true,
  capabilities: true,
});
```

## Questions?

If you have privacy concerns or questions:

- 📧 Contact: [Your contact email]
- 📚 Documentation: [Link to docs]
- 🐛 Issues: [GitHub issues link]

## Updates

This privacy document is updated as the package evolves. Check back regularly for updates.

**Last Updated**: 2025-01-XX

