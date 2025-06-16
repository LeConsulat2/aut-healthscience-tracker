// instrumentation.ts - Create this file in your project root (same level as package.json)
export async function register() {
    if (typeof globalThis !== 'undefined' && !Promise.withResolvers) {
      // @ts-ignore
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