/**
 * Testing Utilities
 * Mock detection, validation, and comparison utilities for testing
 */

import type {
  DetectionResult,
  PlatformDetectionResult,
  FrameworkDetectionResult,
  CapabilityDetectionResult,
} from '../types';

// Store mock detection result
let mockResult: Partial<DetectionResult> | null = null;

/**
 * Mock detection result for testing
 */
export function mockDetection(result: Partial<DetectionResult>): void {
  mockResult = result;
}

/**
 * Clear mock detection
 */
export function clearMockDetection(): void {
  mockResult = null;
}

/**
 * Get mock detection result
 */
export function getMockDetection(): Partial<DetectionResult> | null {
  return mockResult;
}

/**
 * Check if detection result is valid
 */
export function validateDetection(result: DetectionResult): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate platform
  if (!result.platform) {
    errors.push('Platform detection result is missing');
  } else {
    if (!result.platform.platform) {
      errors.push('Platform type is missing');
    }
    if (!result.platform.runtime) {
      errors.push('Runtime type is missing');
    }
    if (
      typeof result.platform.confidence !== 'number' ||
      result.platform.confidence < 0 ||
      result.platform.confidence > 1
    ) {
      errors.push('Platform confidence must be between 0 and 1');
    }
    if (!Array.isArray(result.platform.methods)) {
      errors.push('Platform methods must be an array');
    }
  }

  // Validate framework
  if (!result.framework) {
    errors.push('Framework detection result is missing');
  } else {
    if (!result.framework.framework) {
      errors.push('Framework type is missing');
    }
    if (
      typeof result.framework.confidence !== 'number' ||
      result.framework.confidence < 0 ||
      result.framework.confidence > 1
    ) {
      errors.push('Framework confidence must be between 0 and 1');
    }
    if (!Array.isArray(result.framework.methods)) {
      errors.push('Framework methods must be an array');
    }
  }

  // Validate capabilities
  if (!result.capabilities) {
    errors.push('Capabilities detection result is missing');
  } else {
    const requiredCapabilities = [
      'webComponents',
      'shadowDOM',
      'customElements',
      'modules',
      'serviceWorker',
      'webWorker',
      'indexedDB',
      'localStorage',
      'sessionStorage',
      'websocket',
      'webgl',
      'webgl2',
      'canvas',
      'audio',
      'video',
      'geolocation',
      'notification',
      'camera',
      'microphone',
    ];

    for (const cap of requiredCapabilities) {
      if (typeof (result.capabilities as unknown as Record<string, unknown>)[cap] !== 'boolean') {
        errors.push(`Capability ${cap} must be a boolean`);
      }
    }
  }

  // Validate timestamp
  if (typeof result.timestamp !== 'number' || result.timestamp <= 0) {
    errors.push('Timestamp must be a positive number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Compare two detection results
 */
export interface DetectionDiff {
  platform?: {
    added?: Partial<PlatformDetectionResult>;
    removed?: Partial<PlatformDetectionResult>;
    changed?: Record<string, { from: unknown; to: unknown }>;
  };
  framework?: {
    added?: Partial<FrameworkDetectionResult>;
    removed?: Partial<FrameworkDetectionResult>;
    changed?: Record<string, { from: unknown; to: unknown }>;
  };
  capabilities?: {
    changed?: Record<string, { from: boolean; to: boolean }>;
  };
  timestamp?: {
    from: number;
    to: number;
    difference: number;
  };
}

export function compareDetections(a: DetectionResult, b: DetectionResult): DetectionDiff {
  const diff: DetectionDiff = {};

  // Compare platform
  if (JSON.stringify(a.platform) !== JSON.stringify(b.platform)) {
    diff.platform = {
      changed: {},
    };

    const platformKeys = new Set([...Object.keys(a.platform), ...Object.keys(b.platform)] as Array<
      keyof PlatformDetectionResult
    >);

    for (const key of platformKeys) {
      const aVal = a.platform[key];
      const bVal = b.platform[key];
      if (JSON.stringify(aVal) !== JSON.stringify(bVal)) {
        diff.platform!.changed![key] = { from: aVal, to: bVal };
      }
    }
  }

  // Compare framework
  if (JSON.stringify(a.framework) !== JSON.stringify(b.framework)) {
    diff.framework = {
      changed: {},
    };

    const frameworkKeys = new Set([
      ...Object.keys(a.framework),
      ...Object.keys(b.framework),
    ] as Array<keyof FrameworkDetectionResult>);

    for (const key of frameworkKeys) {
      const aVal = a.framework[key];
      const bVal = b.framework[key];
      if (JSON.stringify(aVal) !== JSON.stringify(bVal)) {
        diff.framework!.changed![key] = { from: aVal, to: bVal };
      }
    }
  }

  // Compare capabilities
  const capabilityKeys = [
    'webComponents',
    'shadowDOM',
    'customElements',
    'modules',
    'serviceWorker',
    'webWorker',
    'indexedDB',
    'localStorage',
    'sessionStorage',
    'websocket',
    'webgl',
    'webgl2',
    'canvas',
    'audio',
    'video',
    'geolocation',
    'notification',
    'camera',
    'microphone',
  ] as Array<keyof CapabilityDetectionResult>;

  const capabilityChanges: Record<string, { from: boolean; to: boolean }> = {};
  for (const key of capabilityKeys) {
    if (a.capabilities[key] !== b.capabilities[key]) {
      capabilityChanges[key] = {
        from: a.capabilities[key],
        to: b.capabilities[key],
      };
    }
  }

  if (Object.keys(capabilityChanges).length > 0) {
    diff.capabilities = { changed: capabilityChanges };
  }

  // Compare timestamp
  if (a.timestamp !== b.timestamp) {
    diff.timestamp = {
      from: a.timestamp,
      to: b.timestamp,
      difference: b.timestamp - a.timestamp,
    };
  }

  return diff;
}

/**
 * Check if two detection results are equal (ignoring timestamp)
 */
export function areDetectionsEqual(
  a: DetectionResult,
  b: DetectionResult,
  ignoreTimestamp = true
): boolean {
  if (ignoreTimestamp) {
    const { timestamp: _, ...aWithoutTimestamp } = a;
    const { timestamp: __, ...bWithoutTimestamp } = b;
    return JSON.stringify(aWithoutTimestamp) === JSON.stringify(bWithoutTimestamp);
  }

  return JSON.stringify(a) === JSON.stringify(b);
}
