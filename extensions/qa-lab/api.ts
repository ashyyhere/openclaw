// extensions/qa-lab api helpers and runtime behavior.
/** Re-exported qa-lab plugin public API. */
export {
  buildQaBusSnapshot,
  cloneEvent,
  cloneMessage,
  DEFAULT_ACCOUNT_ID,
  normalizeAccountId,
  normalizeConversationFromTarget,
  pollQaBusEvents,
  readQaBusMessage,
  searchQaBusMessages,
} from "./src/bus-queries.js";
/** Re-exported qa-lab plugin public API. */
export {
  closeQaHttpServer,
  createQaBusServer,
  handleQaBusRequest,
  startQaBusServer,
  writeError,
  writeJson,
} from "./src/bus-server.js";
/** Re-exported qa-lab plugin public API, starting with create Qa Bus State. */
export { createQaBusState, type QaBusState } from "./src/bus-state.js";
/** Re-exported qa-lab plugin public API. */
export {
  createQaBusWaiterStore,
  DEFAULT_WAIT_TIMEOUT_MS,
  type QaBusWaitMatch,
} from "./src/bus-waiters.js";
/** Re-exported qa-lab plugin public API, starting with is Qa Lab Cli Available. */
export { isQaLabCliAvailable, registerQaLabCli } from "./src/cli.js";
/** Re-exported qa-lab plugin public API, starting with create Qa Runner Runtime. */
export { createQaRunnerRuntime } from "./src/harness-runtime.js";
/** Re-exported qa-lab plugin public API. */
export {
  type QaLabLatestReport,
  type QaLabScenarioOutcome,
  type QaLabScenarioRun,
  type QaLabServerHandle,
  type QaLabServerStartParams,
  startQaLabServer,
} from "./src/lab-server.js";
/** Re-exported qa-lab plugin public API, starting with build Qa Docker Harness Image. */
export { buildQaDockerHarnessImage, writeQaDockerHarnessFiles } from "./src/docker-harness.js";
/** Re-exported qa-lab plugin public API. */
export {
  buildQaScenarioPlanMarkdown,
  readQaAgentIdentityMarkdown,
} from "./src/qa-agent-bootstrap.js";
/** Re-exported qa-lab plugin public API, starting with seed Qa Agent Workspace. */
export { seedQaAgentWorkspace } from "./src/qa-agent-workspace.js";
/** Re-exported qa-lab plugin public API. */
export {
  buildQaGatewayConfig,
  DEFAULT_QA_CONTROL_UI_ALLOWED_ORIGINS,
  mergeQaControlUiAllowedOrigins,
  normalizeQaThinkingLevel,
  QA_BASE_RUNTIME_PLUGIN_IDS,
  type QaThinkingLevel,
} from "./src/qa-gateway-config.js";
/** Re-exported qa-lab plugin public API. */
export {
  renderQaMarkdownReport,
  type QaReportCheck,
  type QaReportScenario,
} from "openclaw/plugin-sdk/qa-runtime";
/** Re-exported qa-lab plugin public API. */
export {
  type QaScenarioDefinition,
  type QaScenarioResult,
  type QaScenarioStep,
  type QaScenarioStepContext,
  type QaScenarioStepResult,
  runQaScenario,
} from "./src/scenario.js";
/** Re-exported qa-lab plugin public API. */
export {
  DEFAULT_QA_AGENT_IDENTITY_MARKDOWN,
  hasQaScenarioPack,
  listQaScenarioMarkdownPaths,
  type QaBootstrapScenarioCatalog,
  type QaScenarioExecution,
  type QaScenarioFlow,
  type QaScenarioPack,
  type QaSeedScenario,
  type QaSeedScenarioWithSource,
  readQaBootstrapScenarioCatalog,
  readQaScenarioById,
  readQaScenarioExecutionConfig,
  readQaScenarioOverviewMarkdown,
  readQaScenarioPack,
  readQaScenarioPackMarkdown,
  validateQaScenarioExecutionConfig,
} from "./src/scenario-catalog.js";
/** Re-exported qa-lab plugin public API, starting with create Qa Self Check Scenario. */
export { createQaSelfCheckScenario } from "./src/self-check-scenario.js";
/** Re-exported qa-lab plugin public API. */
export {
  type QaSelfCheckResult,
  resolveQaSelfCheckOutputPath,
  runQaSelfCheckAgainstState,
} from "./src/self-check.js";
/** Re-exported qa-lab plugin public API, starting with run Qa E2e Self Check. */
export { runQaE2eSelfCheck, runQaLabSelfCheck } from "./src/self-check-runner.js";
/** Re-exported qa-lab plugin public API. */
export {
  testing,
  testing as __testing,
  buildQaRuntimeEnv,
  type QaCliBackendAuthMode,
  type QaGatewayChildCommand,
  type QaGatewayChildStateMutationContext,
  resolveQaControlUiRoot,
  resolveQaGatewayChildProviderMode,
  startQaGatewayChild,
} from "./src/gateway-child.js";
/** Re-exported qa-lab plugin public API. */
export {
  buildQaSuiteSummaryJson,
  qaSuiteProgressTesting,
  type QaSuiteResult,
  type QaSuiteRunParams,
  type QaSuiteScenarioResult,
  type QaSuiteStartLabFn,
  type QaSuiteSummaryJson,
  type QaSuiteSummaryJsonParams,
  runQaSuite,
} from "./src/suite.js";
