// Vitest project config for source unit tests outside ACP/security lanes.
import { createUnitVitestConfigWithOptions } from "./vitest.unit.config.ts";

/** Default source-unit Vitest project configuration. */
export default createUnitVitestConfigWithOptions(process.env, {
  name: "unit-src",
  includePatterns: ["src/**/*.test.ts"],
  extraExcludePatterns: ["src/acp/**", "src/security/**"],
});
