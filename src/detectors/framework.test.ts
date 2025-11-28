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
  isRemix,
  isReact,
  shouldUseReactNative,
  shouldUseReactWrapper,
  shouldUseWebComponents,
  supportsESM,
  supportsWebComponents,
} from './framework';
import * as platform from './platform';

describe('Framework Detection', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    // Clean up any global state
    delete (globalThis as any).React;
    delete (globalThis as any).Vue;
    delete (globalThis as any).ng;
    delete (globalThis as any).__NEXT_DATA__;
    delete (globalThis as any).__VUE__;
    delete (globalThis as any).___gatsby;
    delete (globalThis as any).__flutter__;
    delete (globalThis as any).FlutterWebView;
    delete (globalThis as any).__remixContext;
    delete (globalThis as any).__remixManifest;
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
      (globalThis as any).__flutter__ = true;
      expect(isFlutter()).toBe(true);
      delete (globalThis as any).__flutter__;
    });

    it('should return false if not in browser', () => {
      const origIsBrowser = jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(isFlutter()).toBe(false);
      origIsBrowser.mockRestore();
    });

    it('should return true if FlutterWebView is present', () => {
      (globalThis as any).FlutterWebView = true;
      expect(isFlutter()).toBe(true);
      delete (globalThis as any).FlutterWebView;
    });
  });

  describe('isReact', () => {
    it('should return false when React is not present', () => {
      expect(isReact()).toBe(false);
    });

    it('should detect React global', () => {
      (globalThis as any).React = { version: '18.0.0' };
      expect(isReact()).toBe(true);
      delete (globalThis as any).React;
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
      (globalThis as any).__NEXT_DATA__ = {};
      expect(isNextJS()).toBe(true);
      delete (globalThis as any).__NEXT_DATA__;
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
    it('should detect Remix global', () => {
      (globalThis as any).__remixContext = {};
      expect(isRemix()).toBe(true);
      delete (globalThis as any).__remixContext;
    });
    it('should detect Remix manifest', () => {
      (globalThis as any).__remixManifest = {};
      expect(isRemix()).toBe(true);
      delete (globalThis as any).__remixManifest;
    });
    it('should detect Remix root element', () => {
      const root = document.createElement('div');
      root.setAttribute('data-remix-root', '');
      document.body.appendChild(root);
      expect(isRemix()).toBe(true);
      document.body.removeChild(root);
    });
  });

  describe('isGatsby', () => {
    it('should return false when Gatsby is not present', () => {
      expect(isGatsby()).toBe(false);
    });
    it('should detect Gatsby global', () => {
      (globalThis as any).___gatsby = {};
      expect(isGatsby()).toBe(true);
      delete (globalThis as any).___gatsby;
    });
    it('should detect Gatsby root element', () => {
      const root = document.createElement('div');
      root.id = '___gatsby';
      document.body.appendChild(root);
      expect(isGatsby()).toBe(true);
      document.body.removeChild(root);
    });
  });

  describe('isAngular', () => {
    it('should return false when Angular is not present', () => {
      expect(isAngular()).toBe(false);
    });
    it('should detect Angular global', () => {
      (globalThis as any).ng = {};
      expect(isAngular()).toBe(true);
      delete (globalThis as any).ng;
    });
    it('should detect Angular root element with ng-version', () => {
      const root = document.createElement('div');
      root.setAttribute('ng-version', '15.0.0');
      document.body.appendChild(root);
      expect(isAngular()).toBe(true);
      document.body.removeChild(root);
    });
    it('should detect Angular element with _nghost attribute', () => {
      const root = document.createElement('div');
      root.setAttribute('_nghost', '');
      document.body.appendChild(root);
      expect(isAngular()).toBe(true);
      document.body.removeChild(root);
    });
    it('should detect Angular element with _ngcontent attribute', () => {
      const root = document.createElement('div');
      root.setAttribute('_ngcontent', '');
      document.body.appendChild(root);
      expect(isAngular()).toBe(true);
      document.body.removeChild(root);
    });
    it('should detect Angular via getAllAngularRootElements', () => {
      (window as any).getAllAngularRootElements = () => [];
      expect(isAngular()).toBe(true);
      delete (window as any).getAllAngularRootElements;
    });
    it('should detect Angular via getAllAngularTestabilities', () => {
      (window as any).getAllAngularTestabilities = () => [];
      expect(isAngular()).toBe(true);
      delete (window as any).getAllAngularTestabilities;
    });
  });

  describe('getReactVersion', () => {
    it('should return undefined when React is not present', () => {
      expect(getReactVersion()).toBeUndefined();
    });

    it('should return React version', () => {
      (globalThis as any).React = { version: '18.2.0' };
      expect(getReactVersion()).toBe('18.2.0');
      delete (globalThis as any).React;
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
      (globalThis as any).Vue = { version: '3.3.0' };
      expect(getVueVersion()).toBe('3.3.0');
      delete (globalThis as any).Vue;
    });
  });

  describe('detectFramework', () => {
    it('should default to web framework', () => {
      const framework = detectFramework();
      expect(framework).toBe('web');
    });

    it('should detect React', () => {
      (globalThis as any).React = { version: '18.0.0' };
      expect(detectFramework()).toBe('react');
      delete (globalThis as any).React;
    });

    it('should detect Next.js (prioritized over React)', () => {
      (globalThis as any).React = { version: '18.0.0' };
      (globalThis as any).__NEXT_DATA__ = {};
      expect(detectFramework()).toBe('next');
      delete (globalThis as any).React;
      delete (globalThis as any).__NEXT_DATA__;
    });

    it('should detect Vue', () => {
      (globalThis as any).Vue = { version: '3.0.0' };
      expect(detectFramework()).toBe('vue');
      delete (globalThis as any).Vue;
    });

    it('should detect Angular', () => {
      (globalThis as any).ng = {};
      expect(detectFramework()).toBe('angular');
      delete (globalThis as any).ng;
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
      (globalThis as any).React = { version: '18.2.0' };

      const result = detectFrameworkInfo();

      expect(result.framework).toBe('react');
      expect(result.version).toBe('18.2.0');

      delete (globalThis as any).React;
    });
  });

  describe('shouldUseWebComponents', () => {
    it('should return boolean', () => {
      const result = shouldUseWebComponents();
      expect(typeof result).toBe('boolean');
    });

    it('should return false for React', () => {
      (globalThis as any).React = { version: '18.0.0' };
      expect(shouldUseWebComponents()).toBe(false);
      delete (globalThis as any).React;
    });
  });

  describe('shouldUseReactWrapper', () => {
    it('should return boolean', () => {
      const result = shouldUseReactWrapper();
      expect(typeof result).toBe('boolean');
    });

    it('should return true for React', () => {
      (globalThis as any).React = { version: '18.0.0' };
      expect(shouldUseReactWrapper()).toBe(true);
      delete (globalThis as any).React;
    });

    it('should return true for Next.js', () => {
      (globalThis as any).__NEXT_DATA__ = {};
      expect(shouldUseReactWrapper()).toBe(true);
      delete (globalThis as any).__NEXT_DATA__;
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

  describe('Uncovered branches and edge cases', () => {
    it('isFlutter: should return false if both __flutter__ and FlutterWebView are falsy', () => {
      (globalThis as any).__flutter__ = undefined;
      (globalThis as any).FlutterWebView = undefined;
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      expect(isFlutter()).toBe(false);
      jest.restoreAllMocks();
      delete (globalThis as any).__flutter__;
      delete (globalThis as any).FlutterWebView;
    });

    it('isReact: should return false if isBrowser returns false', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(isReact()).toBe(false);
      jest.restoreAllMocks();
    });

    it('isReact: should return false if isReactNative returns true', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      jest.spyOn(platform, 'isReactNative').mockReturnValue(true);
      expect(isReact()).toBe(false);
      jest.restoreAllMocks();
    });

    it('isNextJS: should return false if isBrowser returns false', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(isNextJS()).toBe(false);
      jest.restoreAllMocks();
    });

    it('isRemix: should return false if isBrowser returns false', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(isRemix()).toBe(false);
      jest.restoreAllMocks();
    });

    it('isGatsby: should return false if isBrowser returns false', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(isGatsby()).toBe(false);
      jest.restoreAllMocks();
    });

    it('isAngular: should return false if isBrowser returns false', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(isAngular()).toBe(false);
      jest.restoreAllMocks();
    });
  });
});
