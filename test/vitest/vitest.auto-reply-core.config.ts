// Vitest project config for core auto-reply tests.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";
import { autoReplyCoreTestExclude, autoReplyCoreTestInclude } from "./vitest.test-shards.mjs";

/** Create the scoped Vitest config for core auto-reply tests. */
export function createAutoReplyCoreVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig([...autoReplyCoreTestInclude], {
    dir: "src/auto-reply",
    env,
    exclude: [...autoReplyCoreTestExclude],
    name: "auto-reply-core",
  });
}

/** Default auto-reply core Vitest project configuration. */
export default createAutoReplyCoreVitestConfig();
