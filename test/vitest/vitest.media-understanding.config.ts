// Vitest project config for media-understanding tests.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Create the scoped Vitest config for media-understanding tests. */
export function createMediaUnderstandingVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/media-understanding/**/*.test.ts"], {
    dir: "src",
    env,
    name: "media-understanding",
    passWithNoTests: true,
  });
}

/** Default media-understanding Vitest project configuration. */
export default createMediaUnderstandingVitestConfig();
