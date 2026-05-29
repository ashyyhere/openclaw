// logging log test helpers helpers and runtime behavior.
import crypto from "node:crypto";
import path from "node:path";
import { createSuiteTempRootTracker } from "../test-helpers/temp-dir.js";

/** Reused helper for create Suite Log Path Tracker behavior in src/logging. */
export function createSuiteLogPathTracker(prefix: string) {
  const rootTracker = createSuiteTempRootTracker({ prefix });
  let logRoot = "";

  return {
    async setup(): Promise<void> {
      await rootTracker.setup();
      logRoot = await rootTracker.make("case");
    },
    nextPath(): string {
      return path.join(logRoot, `${crypto.randomUUID()}.log`);
    },
    async cleanup(): Promise<void> {
      await rootTracker.cleanup();
      logRoot = "";
    },
  };
}
