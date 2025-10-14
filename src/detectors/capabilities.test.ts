import * as capabilities from './capabilities';
import * as platform from './platform';

describe('capabilities module', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('hasWebComponents', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasWebComponents()).toBe(false);
    });
    it('should return true if customElements and define exist', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      (window as any).customElements = { define: () => {} };
      expect(capabilities.hasWebComponents()).toBe(true);
    });
    it('should return false if customElements is missing', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      delete (window as any).customElements;
      expect(capabilities.hasWebComponents()).toBe(false);
    });
  });

  describe('hasShadowDOM', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasShadowDOM()).toBe(false);
    });
    it('should return true if attachShadow and getRootNode exist', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      (Element.prototype as any).attachShadow = () => {};
      (Element.prototype as any).getRootNode = () => {};
      expect(capabilities.hasShadowDOM()).toBe(true);
    });
    it('should return false if attachShadow is missing', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      delete (Element.prototype as any).attachShadow;
      expect(capabilities.hasShadowDOM()).toBe(false);
    });
  });

  describe('hasCustomElements', () => {
    it('should delegate to hasWebComponents', () => {
      // Since hasCustomElements directly calls hasWebComponents, we just verify the function works
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasCustomElements()).toBe(false);
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      (window as any).customElements = { define: () => {} };
      expect(capabilities.hasCustomElements()).toBe(true);
      jest.restoreAllMocks();
    });
  });

  describe('hasModules', () => {
    it('should return true if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasModules()).toBe(true);
    });
    it('should return true if script has noModule', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const script = document.createElement('script');
      (script as any).noModule = true;
      document.createElement = jest.fn(() => script);
      expect(capabilities.hasModules()).toBe(true);
    });
    it('should return false if script has no noModule', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const script = document.createElement('script');
      delete (script as any).noModule;
      document.createElement = jest.fn(() => script);
      expect(capabilities.hasModules()).toBe(false);
    });
  });

  describe('hasServiceWorker', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasServiceWorker()).toBe(false);
    });
    it('should return true if navigator.serviceWorker exists', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      (navigator as any).serviceWorker = {};
      expect(capabilities.hasServiceWorker()).toBe(true);
    });
    it('should return false if navigator.serviceWorker does not exist', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      delete (navigator as any).serviceWorker;
      expect(capabilities.hasServiceWorker()).toBe(false);
    });
  });

  describe('hasWebWorker', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasWebWorker()).toBe(false);
    });
    it('should return true if Worker is defined', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      (global as any).Worker = class {};
      expect(capabilities.hasWebWorker()).toBe(true);
      delete (global as any).Worker;
    });
    it('should return false if Worker is undefined', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const origWorker = (global as any).Worker;
      delete (global as any).Worker;
      expect(capabilities.hasWebWorker()).toBe(false);
      (global as any).Worker = origWorker;
    });
  });

  describe('hasIndexedDB', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasIndexedDB()).toBe(false);
    });
    it('should return true if indexedDB exists in window', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      (window as any).indexedDB = {};
      expect(capabilities.hasIndexedDB()).toBe(true);
      delete (window as any).indexedDB;
    });
    it('should return false if indexedDB does not exist', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      delete (window as any).indexedDB;
      expect(capabilities.hasIndexedDB()).toBe(false);
    });
  });

  describe('hasLocalStorage', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasLocalStorage()).toBe(false);
    });
    it('should return true if localStorage works', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      expect(capabilities.hasLocalStorage()).toBe(true);
    });
    it('should return false if localStorage throws error', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const origSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });
      expect(capabilities.hasLocalStorage()).toBe(false);
      Storage.prototype.setItem = origSetItem;
    });
  });

  describe('hasSessionStorage', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasSessionStorage()).toBe(false);
    });
    it('should return true if sessionStorage works', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      expect(capabilities.hasSessionStorage()).toBe(true);
    });
    it('should return false if sessionStorage throws error', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const origSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });
      expect(capabilities.hasSessionStorage()).toBe(false);
      Storage.prototype.setItem = origSetItem;
    });
  });

  describe('hasWebSocket', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasWebSocket()).toBe(false);
    });
    it('should return true if WebSocket exists', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      (window as any).WebSocket = class {};
      expect(capabilities.hasWebSocket()).toBe(true);
    });
    it('should return false if WebSocket does not exist', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const origWebSocket = (window as any).WebSocket;
      delete (window as any).WebSocket;
      expect(capabilities.hasWebSocket()).toBe(false);
      (window as any).WebSocket = origWebSocket;
    });
  });

  describe('hasWebGL', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasWebGL()).toBe(false);
    });
    it('should return true if WebGL is supported', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const mockCanvas = {
        getContext: jest.fn((type) => {
          if (type === 'webgl' || type === 'experimental-webgl') {
            return {};
          }
          return null;
        }),
      };
      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);
      expect(capabilities.hasWebGL()).toBe(true);
      jest.restoreAllMocks();
    });
    it('should return false if WebGL is not supported', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const mockCanvas = {
        getContext: jest.fn(() => null),
      };
      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);
      expect(capabilities.hasWebGL()).toBe(false);
      jest.restoreAllMocks();
    });
    it('should return false if getContext throws error', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
        throw new Error('Failed');
      });
      expect(capabilities.hasWebGL()).toBe(false);
      createElementSpy.mockRestore();
      jest.restoreAllMocks();
    });
  });

  describe('hasWebGL2', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasWebGL2()).toBe(false);
    });
    it('should return true if WebGL2 is supported', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const mockCanvas = {
        getContext: jest.fn((type) => {
          if (type === 'webgl2') {
            return {};
          }
          return null;
        }),
      };
      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);
      expect(capabilities.hasWebGL2()).toBe(true);
      jest.restoreAllMocks();
    });
    it('should return false if WebGL2 is not supported', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const mockCanvas = {
        getContext: jest.fn(() => null),
      };
      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);
      expect(capabilities.hasWebGL2()).toBe(false);
      jest.restoreAllMocks();
    });
    it('should return false if getContext throws error', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
        throw new Error('Failed');
      });
      expect(capabilities.hasWebGL2()).toBe(false);
      createElementSpy.mockRestore();
      jest.restoreAllMocks();
    });
  });

  describe('hasCanvas', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasCanvas()).toBe(false);
    });
    it('should return true if Canvas is supported', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const mockCanvas = {
        getContext: jest.fn(() => ({})),
      };
      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);
      expect(capabilities.hasCanvas()).toBe(true);
      jest.restoreAllMocks();
    });
    it('should return false if Canvas is not supported', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const mockCanvas = {};
      jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);
      expect(capabilities.hasCanvas()).toBe(false);
      jest.restoreAllMocks();
    });
    it('should return false if createElement throws error', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => {
        throw new Error('Failed');
      });
      expect(capabilities.hasCanvas()).toBe(false);
      // Explicitly restore this mock immediately
      createElementSpy.mockRestore();
      jest.restoreAllMocks();
    });
  });

  describe('hasAudio', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasAudio()).toBe(false);
    });
    it('should return true if Audio is defined', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      (global as any).Audio = class {};
      expect(capabilities.hasAudio()).toBe(true);
    });
    it('should return false if Audio is undefined', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const origAudio = (global as any).Audio;
      delete (global as any).Audio;
      expect(capabilities.hasAudio()).toBe(false);
      (global as any).Audio = origAudio;
    });
  });

  describe('hasVideo', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasVideo()).toBe(false);
    });
    it('should return true if HTMLVideoElement is defined', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      expect(capabilities.hasVideo()).toBe(true);
    });
    it('should return false if HTMLVideoElement is undefined', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const origVideo = (global as any).HTMLVideoElement;
      delete (global as any).HTMLVideoElement;
      expect(capabilities.hasVideo()).toBe(false);
      (global as any).HTMLVideoElement = origVideo;
    });
  });

  describe('hasGeolocation', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasGeolocation()).toBe(false);
    });
    it('should return true if geolocation exists', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      (navigator as any).geolocation = {};
      expect(capabilities.hasGeolocation()).toBe(true);
    });
    it('should return false if geolocation does not exist', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      delete (navigator as any).geolocation;
      expect(capabilities.hasGeolocation()).toBe(false);
    });
  });

  describe('hasNotification', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasNotification()).toBe(false);
    });
    it('should return true if Notification exists', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      (window as any).Notification = class {};
      expect(capabilities.hasNotification()).toBe(true);
    });
    it('should return false if Notification does not exist', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      const origNotification = (window as any).Notification;
      delete (window as any).Notification;
      expect(capabilities.hasNotification()).toBe(false);
      (window as any).Notification = origNotification;
    });
  });

  describe('hasCamera', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasCamera()).toBe(false);
    });
    it('should return true if getUserMedia exists', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      (navigator as any).mediaDevices = { getUserMedia: jest.fn() };
      expect(capabilities.hasCamera()).toBe(true);
    });
    it('should return false if mediaDevices does not exist', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      delete (navigator as any).mediaDevices;
      expect(capabilities.hasCamera()).toBe(false);
    });
    it('should return false if getUserMedia does not exist', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      (navigator as any).mediaDevices = {};
      expect(capabilities.hasCamera()).toBe(false);
    });
  });

  describe('hasMicrophone', () => {
    it('should return false if not in browser', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(false);
      expect(capabilities.hasMicrophone()).toBe(false);
    });
    it('should return true if getUserMedia exists', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      (navigator as any).mediaDevices = { getUserMedia: jest.fn() };
      expect(capabilities.hasMicrophone()).toBe(true);
    });
    it('should return false if mediaDevices does not exist', () => {
      jest.spyOn(platform, 'isBrowser').mockReturnValue(true);
      delete (navigator as any).mediaDevices;
      expect(capabilities.hasMicrophone()).toBe(false);
    });
  });

});
