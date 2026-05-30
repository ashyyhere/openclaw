// Vitest shard config helper wraps shared settings around project lists.
import { defineConfig } from "vitest/config";
import { nonIsolatedRunnerPath, sharedVitestConfig } from "./vitest.shared.config.ts";

/** Create a full-suite shard config from a list of project config paths. */
export function createProjectShardVitestConfig(projects: readonly string[]) {
  const maxWorkers = sharedVitestConfig.test.maxWorkers;
  if (!process.env.OPENCLAW_VITEST_MAX_WORKERS && typeof maxWorkers === "number") {
    process.env.OPENCLAW_VITEST_MAX_WORKERS = String(maxWorkers);
  }
  return defineConfig({
    ...sharedVitestConfig,
    test: {
      ...sharedVitestConfig.test,
      runner: nonIsolatedRunnerPath,
      projects: [...projects],
    },
  });
}
