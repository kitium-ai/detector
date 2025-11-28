/**
 * Localization Information Detection
 * Detects language, timezone, and locale information
 */

import type { LocalizationInfo } from '../types';
import { isBrowser } from '../detectors/platform';

/**
 * Detect localization information
 */
export function detectLocalizationInfo(): LocalizationInfo {
  if (!isBrowser()) {
    return {
      language: 'en',
      languages: ['en'],
      timezone: 'UTC',
      locale: 'en-US',
    };
  }

  const language = navigator.language || 'en';
  const languages = Array.from(navigator.languages || [language]);

  // Get timezone
  let timezone = 'UTC';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    // Fallback if timezone detection fails
  }

  // Get locale from Intl API
  let locale = language;
  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions();
    locale = resolved.locale || language;
  } catch {
    // Fallback if locale detection fails
  }

  return {
    language,
    languages,
    timezone,
    locale,
  };
}
