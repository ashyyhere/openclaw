// Fetch mocks for provider usage/telemetry tests.
import { vi } from "vitest";
import { withFetchPreconnect } from "./fetch-mock.js";

type UsageFetchInput = string | Request | URL;
type UsageFetchHandler = (url: string, init?: RequestInit) => Promise<Response> | Response;
type UsageFetchMock = ReturnType<
  typeof vi.fn<(input: UsageFetchInput, init?: RequestInit) => Promise<Response>>
>;

/** Build a Response from JSON-like or string body content. */
export function makeResponse(status: number, body: unknown): Response {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  const headers = typeof body === "string" ? undefined : { "Content-Type": "application/json" };
  return new Response(payload, { status, headers });
}

/** Convert fetch input variants into a URL string for mock routing. */
export function toRequestUrl(input: UsageFetchInput): string {
  return typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
}

/** Create a preconnect-compatible fetch mock backed by a URL handler. */
export function createProviderUsageFetch(
  handler: UsageFetchHandler,
): typeof fetch & UsageFetchMock {
  const mockFetch = vi.fn(async (input: UsageFetchInput, init?: RequestInit) =>
    handler(toRequestUrl(input), init),
  );
  return withFetchPreconnect(mockFetch) as typeof fetch & UsageFetchMock;
}
