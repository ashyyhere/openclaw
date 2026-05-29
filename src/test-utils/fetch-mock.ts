// test-utils fetch mock helpers and runtime behavior.
/** Shared type for Fetch Mock in src/test-utils. */
export type FetchMock = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

type FetchPreconnectOptions = {
  dns?: boolean;
  tcp?: boolean;
  http?: boolean;
  https?: boolean;
};

type FetchWithPreconnect = {
  preconnect: (url: string | URL, options?: FetchPreconnectOptions) => void;
  __openclawAcceptsDispatcher: true;
};

/** Reused helper for with Fetch Preconnect behavior in src/test-utils. */
export function withFetchPreconnect<T extends typeof fetch>(fn: T): T & FetchWithPreconnect;
/** Reused helper for with Fetch Preconnect behavior in src/test-utils. */
export function withFetchPreconnect<T extends object>(
  fn: T,
): T & FetchWithPreconnect & typeof fetch;
/** Reused helper for with Fetch Preconnect behavior in src/test-utils. */
export function withFetchPreconnect(fn: object) {
  return Object.assign(fn, {
    preconnect: (_url: string | URL, _options?: FetchPreconnectOptions) => {},
    __openclawAcceptsDispatcher: true as const,
  });
}
