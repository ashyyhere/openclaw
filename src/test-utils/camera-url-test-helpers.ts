// Camera URL test helpers for fetch stubs and temporary output reads.
import * as fs from "node:fs/promises";
import { vi } from "vitest";
import { withFetchPreconnect } from "./fetch-mock.js";

/** Stub global fetch with a fixed Response and preconnect-compatible shape. */
export function stubFetchResponse(response: Response) {
  vi.stubGlobal("fetch", withFetchPreconnect(vi.fn(async () => response)));
}

/** Stub global fetch with a text Response and optional response init. */
export function stubFetchTextResponse(text: string, init?: ResponseInit) {
  stubFetchResponse(new Response(text, { status: 200, ...init }));
}

/** Read a temporary UTF-8 file and remove it afterwards. */
export async function readFileUtf8AndCleanup(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf8");
  } finally {
    await fs.unlink(filePath).catch(() => {});
  }
}
