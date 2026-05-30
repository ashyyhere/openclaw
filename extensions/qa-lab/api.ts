// QA Lab public API barrel exposes bus, CLI, gateway, scenario, self-check, and suite helpers.
/** QA bus query and cloning helpers. */
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
/** QA bus HTTP server helpers. */
export {
  closeQaHttpServer,
  createQaBusServer,
  handleQaBusRequest,
  startQaBusServer,
  writeError,
  writeJson,
} from "./src/bus-server.js";
/** QA bus in-memory state factory and type. */
export { createQaBusState, type QaBusState } from "./src/bus-state.js";
/** QA bus waiter store helpers for polling tests. */
export {
  createQaBusWaiterStore,
  DEFAULT_WAIT_TIMEOUT_MS,
  type QaBusWaitMatch,
} from "./src/bus-waiters.js";
/** QA Lab CLI availability and registration helpers. */
export { isQaLabCliAvailable, registerQaLabCli } from "./src/cli.js";
/** QA runner runtime factory used by harness integrations. */
export { createQaRunnerRuntime } from "./src/harness-runtime.js";
/** QA Lab server types and startup helper. */
export {
  type QaLabLatestReport,
  type QaLabScenarioOutcome,
  type QaLabScenarioRun,
  type QaLabServerHandle,
  type QaLabServerStartParams,
  startQaLabServer,
} from "./src/lab-server.js";
/** QA Docker harness scaffold and image helpers. */
export { buildQaDockerHarnessImage, writeQaDockerHarnessFiles } from "./src/docker-harness.js";
/** QA agent bootstrap Markdown helpers. */
export {
  buildQaScenarioPlanMarkdown,
  readQaAgentIdentityMarkdown,
} from "./src/qa-agent-bootstrap.js";
/** QA agent workspace seeding helper. */
export { seedQaAgentWorkspace } from "./src/qa-agent-workspace.js";
/** QA gateway config helpers and constants. */
export {
  buildQaGatewayConfig,
  DEFAULT_QA_CONTROL_UI_ALLOWED_ORIGINS,
  mergeQaControlUiAllowedOrigins,
  normalizeQaThinkingLevel,
  QA_BASE_RUNTIME_PLUGIN_IDS,
  type QaThinkingLevel,
} from "./src/qa-gateway-config.js";
/** Shared QA Markdown report renderer and report types. */
export {
  renderQaMarkdownReport,
  type QaReportCheck,
  type QaReportScenario,
} from "openclaw/plugin-sdk/qa-runtime";
/** QA scenario definition and runner helpers. */
export {
  type QaScenarioDefinition,
  type QaScenarioResult,
  type QaScenarioStep,
  type QaScenarioStepContext,
  type QaScenarioStepResult,
  runQaScenario,
} from "./src/scenario.js";
/** QA scenario catalog readers and types. */
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
/** QA self-check scenario factory. */
export { createQaSelfCheckScenario } from "./src/self-check-scenario.js";
/** QA self-check output and state validation helpers. */
export {
  type QaSelfCheckResult,
  resolveQaSelfCheckOutputPath,
  runQaSelfCheckAgainstState,
} from "./src/self-check.js";
/** QA self-check runners. */
export { runQaE2eSelfCheck, runQaLabSelfCheck } from "./src/self-check-runner.js";
/** QA gateway child process helpers and test utilities. */
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
/** QA suite runner, summary builder, and result types. */
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
