// Mock for @kitiumai/logger
export function getLogger() {
  return {
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
    trace: () => {},
    log: () => {},
  };
}
