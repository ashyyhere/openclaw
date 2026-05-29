// Focused public test helpers for Node builtin module mocks.

/** Re-exported API for src/plugin-sdk. */
export {
  mockNodeBuiltinModule,
  mockNodeChildProcessExecFile,
  mockNodeChildProcessSpawnSync,
} from "./test-helpers/node-builtin-mocks.js";
/** Re-exported API for src/plugin-sdk. */
export {
  withMockedPlatform,
  withMockedWindowsPlatform,
  withRestoredMocks,
} from "../test-utils/vitest-spies.js";
