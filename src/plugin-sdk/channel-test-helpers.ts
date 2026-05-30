/** Public SDK barrel for channel test helper utilities. */
export { createDirectoryTestRuntime, expectDirectorySurface } from "./test-helpers/directory.js";
/** Directory id assertion helpers for channel tests. */
export { expectDirectoryIds, type DirectoryListFn } from "./test-helpers/directory-ids.js";
/** Contract suites shared by channel plugin test packages. */
export {
  expectChannelPluginContract,
  installChannelActionsContractSuite,
  installChannelPluginContractSuite,
  installChannelSetupContractSuite,
  installChannelStatusContractSuite,
} from "./test-helpers/channel-contract-suites.js";
/** Outbound delivery registry and hook helpers for channel tests. */
export {
  addTestHook,
  createEmptyPluginRegistry,
  createOutboundTestPlugin,
  createTestRegistry,
  initializeGlobalHookRunner,
  releasePinnedPluginChannelRegistry,
  resetGlobalHookRunner,
  setActivePluginRegistry,
  type PluginHookRegistration,
} from "./test-helpers/outbound-delivery.js";
/** @deprecated Direct outbound delivery is runtime substrate; use channel message runtime helpers. */
export { deliverOutboundPayloads } from "./test-helpers/outbound-delivery.js";
/** Plugin runtime mocks for channel test surfaces. */
export {
  createPluginRuntimeMediaMock,
  createPluginRuntimeMock,
  type PluginRuntimeMediaMock,
} from "./test-helpers/plugin-runtime-mock.js";
/** Send-config threading helpers and expectations. */
export {
  createSendCfgThreadingRuntime,
  expectProvidedCfgSkipsRuntimeLoad,
  expectRuntimeCfgFallback,
} from "./test-helpers/send-config.js";
/** Start-account fixture context builder. */
export { createStartAccountContext } from "./test-helpers/start-account-context.js";
/** Account lifecycle helpers for pending/start/abort tests. */
export {
  abortStartedAccount,
  expectLifecyclePatch,
  expectPendingUntilAbort,
  expectStopPendingUntilAbort,
  startAccountAndTrackLifecycle,
  waitForStartedMocks,
} from "./test-helpers/start-account-lifecycle.js";
/** Status issue assertion for open-DM policy config warnings. */
export { expectOpenDmPolicyConfigIssue } from "./test-helpers/status-issues.js";
/** Subagent hook registration assertions for channel tests. */
export {
  getRequiredHookHandler,
  registerHookHandlersForTest,
} from "./test-helpers/subagent-hooks.js";
/** Assertion helper for bundled channel entry metadata. */
export { assertBundledChannelEntries } from "./test-helpers/bundled-channel-entry.js";
/** Envelope timestamp formatting helpers for channel fixtures. */
export {
  escapeRegExp,
  formatEnvelopeTimestamp,
  formatLocalEnvelopeTimestamp,
} from "./test-helpers/envelope-timestamp.js";
/** Pairing reply text and code extraction helpers. */
export { expectPairingReplyText, extractPairingCode } from "./test-helpers/pairing-reply.js";
export { stripAnsi } from "../../packages/terminal-core/src/ansi.js";
