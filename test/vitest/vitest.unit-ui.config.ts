// test/vitest vitest unit ui config helpers and runtime behavior.
import { unitUiIncludePatterns } from "./vitest.ui-paths.mjs";
import { createUiVitestConfig } from "./vitest.ui.config.ts";

export default createUiVitestConfig(process.env, {
  includePatterns: unitUiIncludePatterns,
  name: "unit-ui",
});
