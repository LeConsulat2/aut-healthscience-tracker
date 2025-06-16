// instrumentation.ts - This file should be in your PROJECT ROOT (same level as package.json)
// NOT in the app/ folder
export async function register() {
    if (typeof globalThis !== 'undefined' && !Promise.withResolvers) {
      // @ts-expect-error - Promise.withResolvers is not available in Node.js < 22
      Promise.withResolvers = function() {
        let resolve, reject;
        const promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
        return { promise, resolve, reject };
      };
    }
  }