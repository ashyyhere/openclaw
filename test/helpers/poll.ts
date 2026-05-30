// Polling helper retries async assertions until they return a value or time out.
import { sleep } from "../../src/utils.js";

/** Polling options for async test wait helpers. */
export type PollOptions = {
  timeoutMs?: number;
  intervalMs?: number;
};

/** Poll until the callback returns a non-nullish value or timeout elapses. */
export async function pollUntil<T>(
  fn: () => Promise<T | null | undefined>,
  opts: PollOptions = {},
): Promise<T | undefined> {
  const timeoutMs = opts.timeoutMs ?? 2000;
  const intervalMs = opts.intervalMs ?? 25;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const value = await fn();
    if (value !== null && value !== undefined) {
      return value;
    }
    await sleep(intervalMs);
  }

  return undefined;
}
