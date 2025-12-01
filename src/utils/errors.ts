/**
 * Error handling for detector package
 * Uses @kitiumai/error for structured, enterprise-grade error management
 */

import { KitiumError } from '@kitiumai/error';
import type { ErrorMetadata } from '../types/index.js';

/**
 * Create a detection configuration error
 * @param message The error message
 * @param context Additional context for the error
 */
export function createDetectionConfigError(
  message: string,
  context?: Record<string, unknown>
): KitiumError {
  return new KitiumError({
    code: 'detector/config_error',
    message: `Detection configuration error: ${message}`,
    statusCode: 400,
    severity: 'error',
    kind: 'validation',
    retryable: false,
    help: 'Check detector configuration options and ensure all required settings are provided',
    docs: 'https://docs.kitium.ai/errors/detector/config_error',
    context,
  });
}

/**
 * Create a detection timeout error
 * @param operation The operation that timed out
 * @param latencyBudgetMs The latency budget in milliseconds
 * @param context Additional context for the error
 */
export function createDetectionTimeoutError(
  operation: string,
  latencyBudgetMs: number,
  context?: Record<string, unknown>
): KitiumError {
  return new KitiumError({
    code: 'detector/timeout',
    message: `Detection operation exceeded latency budget: ${operation} (${latencyBudgetMs}ms)`,
    statusCode: 504,
    severity: 'warning',
    kind: 'timeout',
    retryable: true,
    help: 'Increase latency budget or disable expensive detection features',
    docs: 'https://docs.kitium.ai/errors/detector/timeout',
    context: {
      operation,
      latencyBudgetMs,
      ...context,
    },
  });
}

/**
 * Create a cache operation error
 * @param operation The cache operation that failed (get, set, clear)
 * @param reason The reason for the failure
 * @param context Additional context for the error
 */
export function createCacheOperationError(
  operation: string,
  reason: string,
  context?: Record<string, unknown>
): KitiumError {
  return new KitiumError({
    code: 'detector/cache_operation_error',
    message: `Cache ${operation} operation failed: ${reason}`,
    statusCode: 500,
    severity: 'warning',
    kind: 'cache',
    retryable: true,
    help: 'Check cache adapter configuration and ensure it is properly initialized',
    docs: 'https://docs.kitium.ai/errors/detector/cache_operation_error',
    context: {
      operation,
      reason,
      ...context,
    },
  });
}

/**
 * Create a capability detection error
 * @param capability The capability that failed detection
 * @param reason The reason for the failure
 * @param context Additional context for the error
 */
export function createCapabilityDetectionError(
  capability: string,
  reason: string,
  context?: Record<string, unknown>
): KitiumError {
  return new KitiumError({
    code: 'detector/capability_detection_error',
    message: `Failed to detect capability '${capability}': ${reason}`,
    statusCode: 500,
    severity: 'warning',
    kind: 'detection',
    retryable: false,
    help: `Check if the ${capability} capability is available in the current environment`,
    docs: 'https://docs.kitium.ai/errors/detector/capability_detection_error',
    context: {
      capability,
      reason,
      ...context,
    },
  });
}

/**
 * Create an async capability detection error
 * @param capability The async capability that failed
 * @param reason The reason for the failure
 * @param context Additional context for the error
 */
export function createAsyncCapabilityError(
  capability: string,
  reason: string,
  context?: Record<string, unknown>
): KitiumError {
  return new KitiumError({
    code: 'detector/async_capability_error',
    message: `Async capability detection failed for '${capability}': ${reason}`,
    statusCode: 500,
    severity: 'warning',
    kind: 'detection',
    retryable: true,
    help: `Check if user has granted permissions for ${capability}`,
    docs: 'https://docs.kitium.ai/errors/detector/async_capability_error',
    context: {
      capability,
      reason,
      ...context,
    },
  });
}

/**
 * Create a plugin execution error
 * @param pluginName The name of the plugin
 * @param reason The reason for the failure
 * @param context Additional context for the error
 */
export function createPluginExecutionError(
  pluginName: string,
  reason: string,
  context?: Record<string, unknown>
): KitiumError {
  return new KitiumError({
    code: 'detector/plugin_execution_error',
    message: `Plugin '${pluginName}' execution failed: ${reason}`,
    statusCode: 500,
    severity: 'error',
    kind: 'plugin',
    retryable: false,
    help: 'Check plugin implementation and ensure it properly handles detection results',
    docs: 'https://docs.kitium.ai/errors/detector/plugin_execution_error',
    context: {
      pluginName,
      reason,
      ...context,
    },
  });
}

/**
 * Create a generic detector error
 * @param message The error message
 * @param context Additional context for the error
 */
export function createDetectorError(
  message: string,
  context?: Record<string, unknown>
): KitiumError {
  return new KitiumError({
    code: 'detector/internal_error',
    message,
    statusCode: 500,
    severity: 'error',
    kind: 'internal',
    retryable: false,
    context,
  });
}

/**
 * Extract error metadata from KitiumError
 * @param error The error to extract metadata from
 */
export function extractErrorMetadata(error: unknown): ErrorMetadata {
  if (error instanceof KitiumError) {
    const json = error.toJSON();
    return {
      code: json.code,
      kind: json.kind,
      severity: json.severity,
      statusCode: json.statusCode,
      retryable: json.retryable,
      help: json.help,
      docs: json.docs,
    };
  }

  return {};
}

/**
 * Backward compatibility: DetectionConfigError extends KitiumError
 * @deprecated Use createDetectionConfigError() instead
 */
export class DetectionConfigError extends KitiumError {
  constructor(message: string) {
    super(createDetectionConfigError(message).toJSON());
    this.name = 'DetectionConfigError';
  }
}

/**
 * Backward compatibility: DetectionTimeoutError extends KitiumError
 * @deprecated Use createDetectionTimeoutError() instead
 */
export class DetectionTimeoutError extends KitiumError {
  constructor(operation: string, latencyBudgetMs: number) {
    super(createDetectionTimeoutError(operation, latencyBudgetMs).toJSON());
    this.name = 'DetectionTimeoutError';
  }
}

/**
 * Backward compatibility: CacheOperationError extends KitiumError
 * @deprecated Use createCacheOperationError() instead
 */
export class CacheOperationError extends KitiumError {
  constructor(operation: string, reason: string) {
    super(createCacheOperationError(operation, reason).toJSON());
    this.name = 'CacheOperationError';
  }
}
