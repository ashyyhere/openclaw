// config config backup rotation test helpers helpers and runtime behavior.
import path from "node:path";
import { expect } from "vitest";

/** Reused constant for IS WINDOWS behavior in src/config. */
export const IS_WINDOWS = process.platform === "win32";

/** Reused helper for resolve Config Path From Temp State behavior in src/config. */
export function resolveConfigPathFromTempState(fileName = "openclaw.json"): string {
  const stateDir = process.env.OPENCLAW_STATE_DIR?.trim();
  if (!stateDir) {
    throw new Error("Expected OPENCLAW_STATE_DIR to be set by withTempHome");
  }
  return path.join(stateDir, fileName);
}

/** Reused helper for expect Posix Mode behavior in src/config. */
export function expectPosixMode(statMode: number, expectedMode: number): void {
  if (IS_WINDOWS) {
    return;
  }
  expect(statMode & 0o777).toBe(expectedMode);
}
