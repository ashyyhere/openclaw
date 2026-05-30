// Focused public test helpers for generic fixtures shared by plugin tests.

/** CLI runtime capture helpers for plugin tests. */
export {
  createCliRuntimeCapture,
  firstWrittenJsonArg,
  spyRuntimeErrors,
  spyRuntimeJson,
  spyRuntimeLogs,
} from "../cli/test-runtime-capture.js";
/** CLI runtime capture fixture types. */
export type { CliMockOutputRuntime, CliRuntimeCapture } from "../cli/test-runtime-capture.js";
/** Sandbox test context factory for plugin and agent tests. */
export { createSandboxTestContext } from "../agents/sandbox/test-fixtures.js";
/** Sandbox config fixture builders. */
export {
  createSandboxBrowserConfig,
  createSandboxPruneConfig,
  createSandboxSshConfig,
} from "./test-helpers/sandbox-fixtures.js";
/** Skill fixture writer for end-to-end tests. */
export { writeSkill } from "../skills/test-support/e2e-test-helpers.js";
/** Agent message fixture builders. */
export {
  castAgentMessage,
  makeAgentAssistantMessage,
  makeAgentUserMessage,
} from "../agents/test-helpers/agent-message-fixtures.js";
/** System event test inspection and reset helpers. */
export { peekSystemEvents, resetSystemEventsForTest } from "../infra/system-events.js";
export { sanitizeTerminalText } from "../../packages/terminal-core/src/safe-text.js";
export { countLines, hasBalancedFences } from "../test-utils/chunk-test-helpers.js";
/** Gateway auth token assertion helper for tests. */
export { expectGeneratedTokenPersistedToGatewayAuth } from "../test-utils/auth-token-assertions.js";
/** Typed table-case helper for tests. */
export { typedCases } from "../test-utils/typed-cases.js";
/** Bundled plugin path fixture helpers. */
export {
  BUNDLED_PLUGIN_PATH_PREFIX,
  BUNDLED_PLUGIN_ROOT_DIR,
  BUNDLED_PLUGIN_TEST_GLOB,
  bundledDistPluginFile,
  bundledDistPluginFileAt,
  bundledDistPluginRoot,
  bundledDistPluginRootAt,
  bundledPluginDirPrefix,
  bundledPluginFile,
  bundledPluginFileAt,
  bundledPluginRoot,
  bundledPluginRootAt,
  installedPluginRoot,
  repoInstallSpec,
} from "./test-helpers/bundled-plugin-paths.js";
/** Fresh module import helper for tests that need isolated module state. */
export { importFreshModule } from "./test-helpers/import-fresh.js";
/** PNG/RGBA image fixture builders. */
export {
  createGrayscaleAlphaPngBuffer,
  createNoisyPngBuffer,
  createNoisyRgbaBuffer,
  createSolidPngBuffer,
} from "./test-helpers/image-fixtures.js";
