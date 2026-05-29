/**
 * Formatting utilities for sandbox CLI output
 */

export function formatStatus(running: boolean): string {
  return running ? "🟢 running" : "⚫ stopped";
}

/** Reused helper for format Simple Status behavior in src/commands. */
export function formatSimpleStatus(running: boolean): string {
  return running ? "running" : "stopped";
}

/** Reused helper for format Image Match behavior in src/commands. */
export function formatImageMatch(matches: boolean): string {
  return matches ? "✓" : "⚠️  mismatch";
}

/** Reused helper for count Running behavior in src/commands. */
export function countRunning(items: readonly { running: boolean }[]): number {
  return items.filter((item) => item.running).length;
}

/** Reused helper for count Mismatches behavior in src/commands. */
export function countMismatches(items: readonly { imageMatch: boolean }[]): number {
  return items.filter((item) => !item.imageMatch).length;
}
