// Vitest project config for serialized cron tests.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Create the scoped Vitest config for cron tests with serialized execution. */
export function createCronVitestConfig(env?: Record<string, string | undefined>) {
  const config = createScopedVitestConfig(["src/cron/**/*.test.ts"], {
    dir: "src",
    env,
    name: "cron",
    passWithNoTests: true,
  });
  config.test = {
    ...config.test,
    maxWorkers: 1,
    fileParallelism: false,
    sequence: {
      ...config.test?.sequence,
      groupOrder: 1,
    },
  };
  return config;
}

/** Default cron Vitest project configuration. */
export default createCronVitestConfig();
