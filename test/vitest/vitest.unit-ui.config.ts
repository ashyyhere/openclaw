// Vitest project config for UI unit tests.
import { unitUiIncludePatterns } from "./vitest.ui-paths.mjs";
import { createUiVitestConfig } from "./vitest.ui.config.ts";

/** Default UI unit Vitest project configuration. */
export default createUiVitestConfig(process.env, {
  includePatterns: unitUiIncludePatterns,
  name: "unit-ui",
});
