/** Test harness helpers for web_fetch unit tests. */
import type { LookupFn } from "../../infra/net/ssrf.js";
import { normalizeLowercaseStringOrEmpty } from "../../shared/string-coerce.js";

/** Creates a minimal Headers-like object for fetch mocks. */
export function makeFetchHeaders(map: Record<string, string>): {
  get: (key: string) => string | null;
} {
  return {
    get: (key) => map[normalizeLowercaseStringOrEmpty(key)] ?? null,
  };
}

/** Creates default web_fetch tool config for tests. */
export function createBaseWebFetchToolConfig(opts?: {
  maxResponseBytes?: number;
  lookupFn?: LookupFn;
}): {
  config: {
    tools: {
      web: {
        fetch: {
          cacheTtlMinutes: number;
          firecrawl: { enabled: boolean };
          maxResponseBytes?: number;
        };
      };
    };
  };
  lookupFn?: LookupFn;
} {
  return {
    config: {
      tools: {
        web: {
          fetch: {
            cacheTtlMinutes: 0,
            firecrawl: { enabled: false },
            ...(opts?.maxResponseBytes ? { maxResponseBytes: opts.maxResponseBytes } : {}),
          },
        },
      },
    },
    ...(opts?.lookupFn ? { lookupFn: opts.lookupFn } : {}),
  };
}
