// Test helper for allocating isolated log file paths per suite.
import crypto from "node:crypto";
import path from "node:path";
import { createSuiteTempRootTracker } from "../test-helpers/temp-dir.js";

/** Creates a suite-scoped temp log root and unique log path generator. */
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
