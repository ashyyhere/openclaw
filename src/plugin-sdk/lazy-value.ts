/** Public SDK helper for caching computed lazy values. */
type LazyValue<T> = T | (() => T);

/** Return a getter that evaluates a function value once and returns the cached result afterward. */
export function createCachedLazyValueGetter<T>(value: LazyValue<T>): () => T;
/** Reused helper for create Cached Lazy Value Getter behavior in src/plugin-sdk. */
export function createCachedLazyValueGetter<T>(
  value: LazyValue<T | null | undefined>,
  fallback: T,
): () => T;
/** Reused helper for create Cached Lazy Value Getter behavior in src/plugin-sdk. */
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
