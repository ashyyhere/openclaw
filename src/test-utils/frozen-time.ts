// test-utils frozen time helpers and runtime behavior.
import { vi } from "vitest";

/** Reused helper for use Frozen Time behavior in src/test-utils. */
export function useFrozenTime(at: string | number | Date): void {
  vi.useFakeTimers();
  vi.setSystemTime(at);
}

/** Reused helper for use Real Time behavior in src/test-utils. */
export function useRealTime(): void {
  vi.useRealTimers();
}
