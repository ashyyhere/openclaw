// plugins/runtime runtime cache helpers and runtime behavior.
/** Reused helper for define Cached Value behavior in src/plugins/runtime. */
export function defineCachedValue(target: object, key: PropertyKey, create: () => unknown): void {
  let cached: unknown;
  let ready = false;
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    get() {
      if (!ready) {
        cached = create();
        ready = true;
      }
      return cached;
    },
  });
}
