// Focused public test helpers for generic fixtures shared by plugin tests.

/** Re-exported API for src/plugin-sdk. */
export {
  createCliRuntimeCapture,
  firstWrittenJsonArg,
  spyRuntimeErrors,
  spyRuntimeJson,
  spyRuntimeLogs,
} from "../cli/test-runtime-capture.js";
/** Re-exported API for src/plugin-sdk, starting with Cli Mock Output Runtime. */
export type { CliMockOutputRuntime, CliRuntimeCapture } from "../cli/test-runtime-capture.js";
/** Re-exported API for src/plugin-sdk, starting with create Sandbox Test Context. */
export { createSandboxTestContext } from "../agents/sandbox/test-fixtures.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createSandboxBrowserConfig,
  createSandboxPruneConfig,
  createSandboxSshConfig,
} from "./test-helpers/sandbox-fixtures.js";
/** Re-exported API for src/plugin-sdk, starting with write Skill. */
export { writeSkill } from "../skills/test-support/e2e-test-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  castAgentMessage,
  makeAgentAssistantMessage,
  makeAgentUserMessage,
} from "../agents/test-helpers/agent-message-fixtures.js";
/** Re-exported API for src/plugin-sdk, starting with peek System Events. */
export { peekSystemEvents, resetSystemEventsForTest } from "../infra/system-events.js";
export { sanitizeTerminalText } from "../../packages/terminal-core/src/safe-text.js";
export { countLines, hasBalancedFences } from "../test-utils/chunk-test-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with expect Generated Token Persisted To Gateway Auth. */
export { expectGeneratedTokenPersistedToGatewayAuth } from "../test-utils/auth-token-assertions.js";
/** Re-exported API for src/plugin-sdk, starting with typed Cases. */
export { typedCases } from "../test-utils/typed-cases.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk, starting with import Fresh Module. */
export { importFreshModule } from "./test-helpers/import-fresh.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createGrayscaleAlphaPngBuffer,
  createNoisyPngBuffer,
  createNoisyRgbaBuffer,
  createSolidPngBuffer,
} from "./test-helpers/image-fixtures.js";
