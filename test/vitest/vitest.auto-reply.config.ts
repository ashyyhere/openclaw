// Auto-reply Vitest config scopes tests to the auto-reply source tree.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Creates the auto-reply Vitest project config. */
export function createAutoReplyVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/auto-reply/**/*.test.ts"], {
    dir: "src/auto-reply",
    env,
    name: "auto-reply",
  });
}

/** Default auto-reply Vitest project config. */
export default createAutoReplyVitestConfig();
