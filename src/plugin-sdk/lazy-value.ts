type LazyValue<T> = T | (() => T);

/** Return a getter that evaluates a function value once and returns the cached result afterward. */
export function createCachedLazyValueGetter<T>(value: LazyValue<T>): () => T;
/** Return a cached getter that falls back when the lazy value resolves nullish. */
export function createCachedLazyValueGetter<T>(
  value: LazyValue<T | null | undefined>,
  fallback: T,
): () => T;
export function createCachedLazyValueGetter<T>(
  value: LazyValue<T | null | undefined>,
  fallback?: T,
): () => T | undefined {
  let resolved = false;
  let cached: T | undefined;

  return () => {
    if (!resolved) {
      const nextValue =
        typeof value === "function" ? (value as () => T | null | undefined)() : value;
      cached = nextValue ?? fallback;
      resolved = true;
    }
    return cached;
  };
}
