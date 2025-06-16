// // instrumentation.ts - This file should be in your PROJECT ROOT (same level as package.json)

// // Promise.withResolvers 타입 정의
// interface PromiseWithResolvers<T> {
//     promise: Promise<T>;
//     resolve: (value: T | PromiseLike<T>) => void;
//     reject: (reason?: unknown) => void;
//   }
  
//   // Promise 인터페이스 확장
//   declare global {
//     interface PromiseConstructor {
//       withResolvers<T = unknown>(): PromiseWithResolvers<T>;
//     }
//   }
  
//   export async function register() {
//     // Apply polyfill to global Promise
//     if (!Promise.withResolvers) {
//       Promise.withResolvers = function<T>(): PromiseWithResolvers<T> {
//         let resolve!: (value: T | PromiseLike<T>) => void;
//         let reject!: (reason?: unknown) => void;
        
//         const promise = new Promise<T>((res, rej) => {
//           resolve = res;
//           reject = rej;
//         });
        
//         return { promise, resolve, reject };
//       };
//     }
  
//     // Also apply to globalThis if available
//     if (typeof globalThis !== 'undefined' && !globalThis.Promise.withResolvers) {
//       globalThis.Promise.withResolvers = Promise.withResolvers;
//     }
  
//     // Apply to global scope if available (Node.js)
//     if (typeof global !== 'undefined' && !global.Promise.withResolvers) {
//       (global as typeof globalThis).Promise.withResolvers = Promise.withResolvers;
//     }
//   }