// test-utils camera url test helpers helpers and runtime behavior.
import * as fs from "node:fs/promises";
import { vi } from "vitest";
import { withFetchPreconnect } from "./fetch-mock.js";

/** Reused helper for stub Fetch Response behavior in src/test-utils. */
export function stubFetchResponse(response: Response) {
  vi.stubGlobal("fetch", withFetchPreconnect(vi.fn(async () => response)));
}

/** Reused helper for stub Fetch Text Response behavior in src/test-utils. */
export function stubFetchTextResponse(text: string, init?: ResponseInit) {
  stubFetchResponse(new Response(text, { status: 200, ...init }));
}

/** Reused helper for read File Utf8 And Cleanup behavior in src/test-utils. */
export async function readFileUtf8AndCleanup(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf8");
  } finally {
    await fs.unlink(filePath).catch(() => {});
  }
}
