/**
 * User-Agent Client Hints API Support
 * Modern, privacy-friendly alternative to User-Agent strings
 * https://wicg.github.io/ua-client-hints/
 */

/**
 * Check if User-Agent Client Hints API is available
 */
export function supportsClientHints(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  return 'userAgentData' in navigator;
}

/**
 * User-Agent Client Hints data structure
 */
export interface ClientHintsData {
  brands: Array<{ brand: string; version: string }>;
  mobile: boolean;
  platform: string;
  platformVersion?: string;
  architecture?: string;
  bitness?: string;
  model?: string;
  uaFullVersion?: string;
}

/**
 * Get User-Agent Client Hints data (low entropy)
 */
export function getClientHintsLowEntropy(): ClientHintsData | null {
  if (!supportsClientHints()) {
    return null;
  }

  const uaData = (
    navigator as unknown as {
      userAgentData?: { brands?: unknown[]; mobile?: boolean; platform?: string };
    }
  ).userAgentData;
  if (!uaData) {
    return null;
  }

  return {
    brands: (uaData.brands as Array<{ brand: string; version: string }>) || [],
    mobile: uaData.mobile || false,
    platform: uaData.platform || '',
  };
}

/**
 * Get User-Agent Client Hints data (high entropy)
 * Requires permission and returns a Promise
 */
export async function getClientHintsHighEntropy(): Promise<ClientHintsData | null> {
  if (!supportsClientHints()) {
    return null;
  }

  const uaData = (
    navigator as unknown as {
      userAgentData?: { getHighEntropyValues?: (hints: string[]) => Promise<unknown> };
    }
  ).userAgentData;
  if (!uaData || typeof uaData.getHighEntropyValues !== 'function') {
    return getClientHintsLowEntropy();
  }

  try {
    const highEntropyValues = (await uaData.getHighEntropyValues([
      'platformVersion',
      'architecture',
      'bitness',
      'model',
      'uaFullVersion',
    ])) as {
      platformVersion?: string;
      architecture?: string;
      bitness?: string;
      model?: string;
      uaFullVersion?: string;
    };

    const lowEntropy = getClientHintsLowEntropy();
    if (!lowEntropy) {
      return null;
    }

    return {
      ...lowEntropy,
      platformVersion: highEntropyValues.platformVersion,
      architecture: highEntropyValues.architecture,
      bitness: highEntropyValues.bitness,
      model: highEntropyValues.model,
      uaFullVersion: highEntropyValues.uaFullVersion,
    };
  } catch {
    // Permission denied or other error, fallback to low entropy
    return getClientHintsLowEntropy();
  }
}

/**
 * Convert Client Hints brand to browser type
 */
export function brandToBrowserType(brand: string): string {
  const brandLower = brand.toLowerCase();

  if (brandLower.includes('chrome')) {
    return 'chrome';
  }
  if (brandLower.includes('edge')) {
    return 'edge';
  }
  if (brandLower.includes('firefox')) {
    return 'firefox';
  }
  if (brandLower.includes('safari')) {
    return 'safari';
  }
  if (brandLower.includes('opera')) {
    return 'opera';
  }

  return 'unknown';
}

/**
 * Get browser from Client Hints brands
 */
export function getBrowserFromClientHints(clientHints: ClientHintsData | null): {
  name: string;
  version?: string;
} | null {
  if (!clientHints || !clientHints.brands || clientHints.brands.length === 0) {
    return null;
  }

  // Find the main browser brand (usually the first non-OS brand)
  const mainBrand =
    clientHints.brands.find(
      (brand) => !['Windows', 'macOS', 'Linux', 'Android', 'iOS'].includes(brand.brand)
    ) || clientHints.brands[0];

  if (!mainBrand) {
    return null;
  }

  return {
    name: brandToBrowserType(mainBrand.brand),
    version: mainBrand.version || clientHints.uaFullVersion,
  };
}
