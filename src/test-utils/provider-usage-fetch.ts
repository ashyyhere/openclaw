// test-utils provider usage fetch helpers and runtime behavior.
import { vi } from "vitest";
import { withFetchPreconnect } from "./fetch-mock.js";

type UsageFetchInput = string | Request | URL;
type UsageFetchHandler = (url: string, init?: RequestInit) => Promise<Response> | Response;
type UsageFetchMock = ReturnType<
  typeof vi.fn<(input: UsageFetchInput, init?: RequestInit) => Promise<Response>>
>;

/** Reused helper for make Response behavior in src/test-utils. */
export function makeResponse(status: number, body: unknown): Response {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  const headers = typeof body === "string" ? undefined : { "Content-Type": "application/json" };
  return new Response(payload, { status, headers });
}

/** Reused helper for to Request Url behavior in src/test-utils. */
export function toRequestUrl(input: UsageFetchInput): string {
  return typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
}

/** Reused helper for create Provider Usage Fetch behavior in src/test-utils. */
export function createProviderUsageFetch(
  handler: UsageFetchHandler,
): typeof fetch & UsageFetchMock {
  const mockFetch = vi.fn(async (input: UsageFetchInput, init?: RequestInit) =>
    handler(toRequestUrl(input), init),
  );
  return withFetchPreconnect(mockFetch) as typeof fetch & UsageFetchMock;
}
