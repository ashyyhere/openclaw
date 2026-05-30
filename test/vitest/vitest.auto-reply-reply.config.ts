// Auto-reply reply Vitest config runs reply subtree tests in an ordered shard.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";
import { autoReplyReplySubtreeTestInclude } from "./vitest.test-shards.mjs";

/** Creates the auto-reply reply Vitest project config. */
export function createAutoReplyReplyVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig([...autoReplyReplySubtreeTestInclude], {
    dir: "src/auto-reply",
    env,
    name: "auto-reply-reply",
    sequence: {
      groupOrder: 1,
    },
  });
}

/** Default auto-reply reply Vitest project config. */
export default createAutoReplyReplyVitestConfig();
