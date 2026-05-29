// Fetch mock helpers that emulate OpenClaw's preconnect-capable fetch shape.
/** Fetch-compatible mock signature accepted by network helper tests. */
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

/** Adds no-op preconnect and dispatcher marker fields to a fetch mock. */
export function withFetchPreconnect<T extends typeof fetch>(fn: T): T & FetchWithPreconnect;
/** Adds no-op preconnect and dispatcher marker fields to an object-style fetch mock. */
export function withFetchPreconnect<T extends object>(
  fn: T,
): T & FetchWithPreconnect & typeof fetch;
/** Implements the shared preconnect marker assignment for fetch mocks. */
export function withFetchPreconnect(fn: object) {
  return Object.assign(fn, {
    preconnect: (_url: string | URL, _options?: FetchPreconnectOptions) => {},
    __openclawAcceptsDispatcher: true as const,
  });
}
