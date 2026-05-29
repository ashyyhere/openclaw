// test/vitest vitest media understanding config helpers and runtime behavior.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

export function createMediaUnderstandingVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/media-understanding/**/*.test.ts"], {
    dir: "src",
    env,
    name: "media-understanding",
    passWithNoTests: true,
  });
}

export default createMediaUnderstandingVitestConfig();
