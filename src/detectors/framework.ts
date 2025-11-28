/**
 * Framework Detection Module
 * Detects JavaScript/TypeScript frameworks and their versions
 */

import type { FrameworkDetectionResult, FrameworkType } from '../types';
import { isBrowser, isNode, isReactNative } from './platform';

/**
 * Detect if running in a server-side rendering environment
 */
export function isServerSide(): boolean {
  return isNode();
}

/**
 * Detect if we're in Flutter WebView
 */
export function isFlutter(): boolean {
  if (!isBrowser()) {
    return false;
  }
  // Explicitly check for both properties and ensure a boolean is always returned
  return Boolean((window as any).__flutter__ || (window as any).FlutterWebView);
}

/**
 * Detect if we're in React (browser)
 */
export function isReact(): boolean {
  if (!isBrowser() || isReactNative()) {
    return false;
  }

  // Check for React's presence
  return !!(
    (window as any).React || // React global
    document.querySelector('[data-reactroot]') || // React 16
    document.querySelector('[data-reactid]') || // React 15
    document.querySelector('#root.__react_root') || // React 18
    Array.from(document.querySelectorAll('*')).some((el) =>
      Object.keys(el).some((key) => key.startsWith('__react') || key.startsWith('_react'))
    )
  );
}

/**
 * Detect if we're in Next.js
 */
export function isNextJS(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return !!(
    (window as any).__NEXT_DATA__ ||
    (window as any).next ||
    document.querySelector('#__next')
  );
}

/**
 * Detect if we're in Remix
 */
export function isRemix(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return !!(
    (window as any).__remixContext ||
    (window as any).__remixManifest ||
    document.querySelector('[data-remix-root]')
  );
}

/**
 * Detect if we're in Gatsby
 */
export function isGatsby(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return !!((window as any).___gatsby || document.querySelector('#___gatsby'));
}

/**
 * Detect if we're in Angular
 */
export function isAngular(): boolean {
  if (!isBrowser()) {
    return false;
  }

  // Check for Angular's global objects
  return !!(
    (window as any).ng || // Angular debug mode
    (window as any).getAllAngularRootElements || // Angular elements
    (window as any).getAllAngularTestabilities || // Angular testability
    document.querySelector('[ng-version]') || // Angular version attribute
    document.querySelector('[_nghost]') || // Angular host attribute
    document.querySelector('[_ngcontent]') // Angular content attribute
  );
}

/**
 * Detect if we're in Vue.js
 */
export function isVue(): boolean {
  if (!isBrowser()) {
    return false;
  }

  // Check for Vue's global objects
  return !!(
    (window as any).Vue || // Vue 2
    (window as any).__VUE__ || // Vue 3 devtools
    (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__?.Vue || // Vue devtools
    document.querySelector('[data-v-]') || // Vue scoped styles
    document.querySelector('.__vue_app__') || // Vue 3 app
    Array.from(document.querySelectorAll('*')).some((el) =>
      Object.keys(el).some((key) => key.startsWith('__vue'))
    )
  );
}

/**
 * Detect if we're in Nuxt.js
 */
export function isNuxt(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return !!((window as any).__NUXT__ || (window as any).$nuxt || document.querySelector('#__nuxt'));
}

/**
 * Detect if we're in Svelte
 */
export function isSvelte(): boolean {
  if (!isBrowser()) {
    return false;
  }

  // Check for Svelte's class naming pattern
  return !!(
    document.querySelector('[class*="svelte-"]') || // Svelte scoped classes
    Array.from(document.querySelectorAll('*')).some((el) =>
      Array.from(el.classList).some((cls) => cls.includes('svelte-'))
    )
  );
}

/**
 * Detect if we're in Solid.js
 */
export function isSolid(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return !!(
    (window as any).Solid ||
    Array.from(document.querySelectorAll('*')).some((el) =>
      Object.keys(el).some((key) => key.startsWith('_$'))
    )
  );
}

/**
 * Detect if we're in Preact
 */
export function isPreact(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return !!((window as any).preact || (window as any).h?.name === 'h');
}

/**
 * Detect if we're in Lit
 */
export function isLit(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return !!(
    (window as any).LitElement ||
    Array.from(document.querySelectorAll('*')).some((el) => el.constructor.name.includes('Lit'))
  );
}

/**
 * Check if browser supports Web Components
 */
export function supportsWebComponents(): boolean {
  // Explicitly call isBrowser() and cast window to any for safety
  if (!(typeof window !== 'undefined' && typeof document !== 'undefined')) {
    return false;
  }
  const win = window as any;
  return !!(
    win.customElements &&
    win.customElements.define &&
    typeof HTMLElement !== 'undefined' &&
    'attachShadow' in HTMLElement.prototype
  );
}

/**
 * Check if environment supports ES Modules
 */
export function supportsESM(): boolean {
  if (isNode()) {
    return true; // Node.js has ESM support
  }

  if (!isBrowser()) {
    return false;
  }

  // Check for <script type="module"> support
  const script = document.createElement('script');
  return 'noModule' in script;
}

/**
 * Get React version
 */
export function getReactVersion(): string | undefined {
  if (!isBrowser()) {
    return undefined;
  }

  return (window as any).React?.version;
}

/**
 * Get Angular version
 */
export function getAngularVersion(): string | undefined {
  if (!isBrowser()) {
    return undefined;
  }

  const ngVersion = document.querySelector('[ng-version]');
  return ngVersion?.getAttribute('ng-version') || undefined;
}

/**
 * Get Vue version
 */
export function getVueVersion(): string | undefined {
  if (!isBrowser()) {
    return undefined;
  }

  return (window as any).Vue?.version || (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__?.Vue?.version;
}

/**
 * Get framework version
 */
export function getFrameworkVersion(framework: FrameworkType): string | undefined {
  switch (framework) {
    case 'react':
    case 'next':
    case 'gatsby':
    case 'remix':
      return getReactVersion();

    case 'angular':
      return getAngularVersion();

    case 'vue':
    case 'nuxt':
      return getVueVersion();

    default:
      return undefined;
  }
}

/**
 * Detect the current framework
 */
export function detectFramework(): FrameworkType {
  // Server-side (Node.js)
  if (isServerSide()) {
    return 'node';
  }

  // Mobile/Native environments
  if (isReactNative()) {
    return 'react-native';
  }

  if (isFlutter()) {
    return 'flutter';
  }

  // React-based frameworks (more specific first)
  if (isNextJS()) {
    return 'next';
  }

  if (isRemix()) {
    return 'remix';
  }

  if (isGatsby()) {
    return 'gatsby';
  }

  // Vue-based frameworks
  if (isNuxt()) {
    return 'nuxt';
  }

  // Other web frameworks (order matters - more specific first)
  if (isAngular()) {
    return 'angular';
  }

  if (isVue()) {
    return 'vue';
  }

  if (isSvelte()) {
    return 'svelte';
  }

  if (isSolid()) {
    return 'solid';
  }

  if (isLit()) {
    return 'lit';
  }

  if (isPreact()) {
    return 'preact';
  }

  if (isReact()) {
    return 'react';
  }

  // Default to vanilla web
  return 'web';
}

/**
 * Complete framework detection with confidence scores
 */
export function detectFrameworkInfo(): FrameworkDetectionResult {
  const methods: string[] = [];
  let confidence = 1.0;

  const framework = detectFramework();
  const version = getFrameworkVersion(framework);
  const wcSupport = supportsWebComponents();
  const esmSupport = supportsESM();

  // Determine confidence based on detection method
  if (isServerSide()) {
    methods.push('server-side-detection');
    confidence = 1.0; // Server-side is definitive
  } else if (isReactNative()) {
    methods.push('react-native-detection');
    confidence = 1.0; // React Native is definitive
  } else if (isFlutter()) {
    methods.push('flutter-detection');
    confidence = 0.9; // Flutter detection is reliable
  } else if (isNextJS()) {
    methods.push('nextjs-detection');
    confidence = 0.95; // Next.js has clear markers
  } else if (isRemix()) {
    methods.push('remix-detection');
    confidence = 0.95; // Remix has clear markers
  } else if (isGatsby()) {
    methods.push('gatsby-detection');
    confidence = 0.95; // Gatsby has clear markers
  } else if (isNuxt()) {
    methods.push('nuxt-detection');
    confidence = 0.95; // Nuxt has clear markers
  } else if (isAngular()) {
    methods.push('angular-detection');
    confidence = 0.9; // Angular detection is reliable
  } else if (isVue()) {
    methods.push('vue-detection');
    confidence = 0.85; // Vue detection can be less certain
  } else if (isSvelte()) {
    methods.push('svelte-detection');
    confidence = 0.85; // Svelte detection can be less certain
  } else if (isSolid()) {
    methods.push('solid-detection');
    confidence = 0.85; // Solid detection can be less certain
  } else if (isLit()) {
    methods.push('lit-detection');
    confidence = 0.85; // Lit detection can be less certain
  } else if (isPreact()) {
    methods.push('preact-detection');
    confidence = 0.8; // Preact detection can be less certain
  } else if (isReact()) {
    methods.push('react-detection');
    confidence = 0.8; // React detection can be less certain (may be false positive)
  } else {
    methods.push('vanilla-detection');
    confidence = 0.7; // Vanilla is default, least certain
  }

  // Lower confidence if version not detected
  if (!version && framework !== 'web' && framework !== 'node') {
    confidence *= 0.9;
  }

  return {
    framework,
    version,
    isSSR: isServerSide(),
    supportsWebComponents: wcSupport,
    supportsESM: esmSupport,
    confidence,
    methods,
  };
}

/**
 * Check if we should use Web Components
 */
export function shouldUseWebComponents(): boolean {
  const detection = detectFrameworkInfo();

  // Use Web Components for frameworks that support them (except React)
  return (
    detection.supportsWebComponents &&
    detection.framework !== 'react' &&
    detection.framework !== 'next' &&
    detection.framework !== 'gatsby' &&
    detection.framework !== 'remix' &&
    detection.framework !== 'react-native'
  );
}

/**
 * Check if we should use React wrapper
 */
export function shouldUseReactWrapper(): boolean {
  const framework = detectFramework();
  return (
    framework === 'react' || framework === 'next' || framework === 'gatsby' || framework === 'remix'
  );
}

/**
 * Check if we should use React Native components
 */
export function shouldUseReactNative(): boolean {
  return detectFramework() === 'react-native';
}
