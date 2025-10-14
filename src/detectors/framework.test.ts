/**
 * Framework Detection Tests
 */

import {
  detectFramework,
  detectFrameworkInfo,
  getAngularVersion,
  getReactVersion,
  getVueVersion,
  isAngular,
  isFlutter,
  isGatsby,
  isNextJS,
  isNuxt,
  isReact,
  isRemix,
  isSvelte,
  isVue,
  shouldUseReactNative,
  shouldUseReactWrapper,
  shouldUseWebComponents,
  supportsESM,
  supportsWebComponents,
} from './framework';

describe('Framework Detection', () => {
  beforeEach(() => {
    // Clean up any global state
    delete (window as any).React;
    delete (window as any).Vue;
    delete (window as any).ng;
    delete (window as any).__NEXT_DATA__;
    delete (window as any).__VUE__;
    delete (window as any).___gatsby;
  });

  describe('supportsWebComponents', () => {
    it('should check for Web Components support', () => {
      const result = supportsWebComponents();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('supportsESM', () => {
    it('should check for ES Modules support', () => {
      const result = supportsESM();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('isFlutter', () => {
    it('should return false when not in Flutter', () => {
      expect(isFlutter()).toBe(false);
    });

    it('should detect Flutter WebView', () => {
      (window as any).__flutter__ = true;
      expect(isFlutter()).toBe(true);
      delete (window as any).__flutter__;
    });
  });

  describe('isReact', () => {
    it('should return false when React is not present', () => {
      expect(isReact()).toBe(false);
    });

    it('should detect React global', () => {
      (window as any).React = { version: '18.0.0' };
      expect(isReact()).toBe(true);
      delete (window as any).React;
    });

    it('should detect React root element', () => {
      const root = document.createElement('div');
      root.setAttribute('data-reactroot', '');
      document.body.appendChild(root);

      expect(isReact()).toBe(true);

      document.body.removeChild(root);
    });
  });

  describe('isNextJS', () => {
    it('should return false when Next.js is not present', () => {
      expect(isNextJS()).toBe(false);
    });

    it('should detect Next.js __NEXT_DATA__', () => {
      (window as any).__NEXT_DATA__ = {};
      expect(isNextJS()).toBe(true);
      delete (window as any).__NEXT_DATA__;
    });

    it('should detect Next.js root element', () => {
      const root = document.createElement('div');
      root.id = '__next';
      document.body.appendChild(root);

      expect(isNextJS()).toBe(true);

      document.body.removeChild(root);
    });
  });

  describe('isRemix', () => {
    it('should return false when Remix is not present', () => {
      expect(isRemix()).toBe(false);
    });

    it('should detect Remix context', () => {
      (window as any).__remixContext = {};
      expect(isRemix()).toBe(true);
      delete (window as any).__remixContext;
    });
  });

  describe('isGatsby', () => {
    it('should return false when Gatsby is not present', () => {
      expect(isGatsby()).toBe(false);
    });

    it('should detect Gatsby global', () => {
      (window as any).___gatsby = {};
      expect(isGatsby()).toBe(true);
      delete (window as any).___gatsby;
    });
  });

  describe('isAngular', () => {
    it('should return false when Angular is not present', () => {
      expect(isAngular()).toBe(false);
    });

    it('should detect Angular global', () => {
      (window as any).ng = {};
      expect(isAngular()).toBe(true);
      delete (window as any).ng;
    });

    it('should detect Angular version attribute', () => {
      const root = document.createElement('div');
      root.setAttribute('ng-version', '15.0.0');
      document.body.appendChild(root);

      expect(isAngular()).toBe(true);

      document.body.removeChild(root);
    });
  });

  describe('isVue', () => {
    it('should return false when Vue is not present', () => {
      expect(isVue()).toBe(false);
    });

    it('should detect Vue 2 global', () => {
      (window as any).Vue = { version: '2.7.0' };
      expect(isVue()).toBe(true);
      delete (window as any).Vue;
    });

    it('should detect Vue 3 devtools', () => {
      (window as any).__VUE__ = true;
      expect(isVue()).toBe(true);
      delete (window as any).__VUE__;
    });
  });

  describe('isNuxt', () => {
    it('should return false when Nuxt is not present', () => {
      expect(isNuxt()).toBe(false);
    });

    it('should detect Nuxt global', () => {
      (window as any).__NUXT__ = {};
      expect(isNuxt()).toBe(true);
      delete (window as any).__NUXT__;
    });
  });

  describe('isSvelte', () => {
    it('should return false when Svelte is not present', () => {
      expect(isSvelte()).toBe(false);
    });

    it('should detect Svelte scoped classes', () => {
      const el = document.createElement('div');
      el.className = 'svelte-abc123';
      document.body.appendChild(el);

      expect(isSvelte()).toBe(true);

      document.body.removeChild(el);
    });
  });

  describe('getReactVersion', () => {
    it('should return undefined when React is not present', () => {
      expect(getReactVersion()).toBeUndefined();
    });

    it('should return React version', () => {
      (window as any).React = { version: '18.2.0' };
      expect(getReactVersion()).toBe('18.2.0');
      delete (window as any).React;
    });
  });

  describe('getAngularVersion', () => {
    it('should return undefined when Angular is not present', () => {
      expect(getAngularVersion()).toBeUndefined();
    });

    it('should return Angular version from attribute', () => {
      const root = document.createElement('div');
      root.setAttribute('ng-version', '15.2.0');
      document.body.appendChild(root);

      expect(getAngularVersion()).toBe('15.2.0');

      document.body.removeChild(root);
    });
  });

  describe('getVueVersion', () => {
    it('should return undefined when Vue is not present', () => {
      expect(getVueVersion()).toBeUndefined();
    });

    it('should return Vue version', () => {
      (window as any).Vue = { version: '3.3.0' };
      expect(getVueVersion()).toBe('3.3.0');
      delete (window as any).Vue;
    });
  });

  describe('detectFramework', () => {
    it('should default to web framework', () => {
      const framework = detectFramework();
      expect(framework).toBe('web');
    });

    it('should detect React', () => {
      (window as any).React = { version: '18.0.0' };
      expect(detectFramework()).toBe('react');
      delete (window as any).React;
    });

    it('should detect Next.js (prioritized over React)', () => {
      (window as any).React = { version: '18.0.0' };
      (window as any).__NEXT_DATA__ = {};
      expect(detectFramework()).toBe('next');
      delete (window as any).React;
      delete (window as any).__NEXT_DATA__;
    });

    it('should detect Vue', () => {
      (window as any).Vue = { version: '3.0.0' };
      expect(detectFramework()).toBe('vue');
      delete (window as any).Vue;
    });

    it('should detect Angular', () => {
      (window as any).ng = {};
      expect(detectFramework()).toBe('angular');
      delete (window as any).ng;
    });
  });

  describe('detectFrameworkInfo', () => {
    it('should return complete framework detection result', () => {
      const result = detectFrameworkInfo();

      expect(result).toHaveProperty('framework');
      expect(result).toHaveProperty('isSSR');
      expect(result).toHaveProperty('supportsWebComponents');
      expect(result).toHaveProperty('supportsESM');

      expect(typeof result.framework).toBe('string');
      expect(typeof result.isSSR).toBe('boolean');
      expect(typeof result.supportsWebComponents).toBe('boolean');
      expect(typeof result.supportsESM).toBe('boolean');
    });

    it('should include version when available', () => {
      (window as any).React = { version: '18.2.0' };

      const result = detectFrameworkInfo();

      expect(result.framework).toBe('react');
      expect(result.version).toBe('18.2.0');

      delete (window as any).React;
    });
  });

  describe('shouldUseWebComponents', () => {
    it('should return boolean', () => {
      const result = shouldUseWebComponents();
      expect(typeof result).toBe('boolean');
    });

    it('should return false for React', () => {
      (window as any).React = { version: '18.0.0' };
      expect(shouldUseWebComponents()).toBe(false);
      delete (window as any).React;
    });
  });

  describe('shouldUseReactWrapper', () => {
    it('should return boolean', () => {
      const result = shouldUseReactWrapper();
      expect(typeof result).toBe('boolean');
    });

    it('should return true for React', () => {
      (window as any).React = { version: '18.0.0' };
      expect(shouldUseReactWrapper()).toBe(true);
      delete (window as any).React;
    });

    it('should return true for Next.js', () => {
      (window as any).__NEXT_DATA__ = {};
      expect(shouldUseReactWrapper()).toBe(true);
      delete (window as any).__NEXT_DATA__;
    });
  });

  describe('shouldUseReactNative', () => {
    it('should return boolean', () => {
      const result = shouldUseReactNative();
      expect(typeof result).toBe('boolean');
    });

    it('should return false in browser environment', () => {
      expect(shouldUseReactNative()).toBe(false);
    });
  });
});
