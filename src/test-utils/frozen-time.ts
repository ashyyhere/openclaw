// Vitest timer helpers for freezing and restoring Date.now/system time.
import { vi } from "vitest";

/** Switch Vitest to fake timers and set the process clock. */
export function useFrozenTime(at: string | number | Date): void {
  vi.useFakeTimers();
  vi.setSystemTime(at);
}

/** Restore Vitest real timers after a frozen-time test. */
export function useRealTime(): void {
  vi.useRealTimers();
}
