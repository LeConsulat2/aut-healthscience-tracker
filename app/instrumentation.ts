// instrumentation.ts - This file should be in your PROJECT ROOT (same level as package.json)
export async function register() {
    // Apply polyfill to global Promise
    if (!Promise.withResolvers) {
      Promise.withResolvers = function() {
        let resolve, reject;
        const promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
        return { promise, resolve, reject };
      };
    }
  
    // Also apply to globalThis if available
    if (typeof globalThis !== 'undefined' && !globalThis.Promise.withResolvers) {
      globalThis.Promise.withResolvers = Promise.withResolvers;
    }
  
    // Apply to global scope if available (Node.js)
    if (typeof global !== 'undefined' && !global.Promise.withResolvers) {
      global.Promise.withResolvers = Promise.withResolvers;
    }
  }