/**
 * Extension-safe session SDK surface.
 *
 * Keep this barrel free of the session runtime and resource loader. The
 * extension loader imports it to virtualize `openclaw/plugin-sdk/agent-sessions`,
 * so importing loader-owned modules here creates runtime cycles.
 */

export { getAgentDir, VERSION } from "../config.js";
export * from "./auth-storage.js";
export * from "./bash-executor.js";
export * from "./compaction/index.js";
export * from "./event-bus.js";
/** Re-exported API for src/agents/sessions, starting with Readonly Footer Data Provider. */
export type { ReadonlyFooterDataProvider } from "./footer-data-provider.js";
/** Re-exported API for src/agents/sessions, starting with convert To Llm. */
export { convertToLlm } from "./messages.js";
export * from "./model-registry.js";
export * from "./model-resolver.js";
export * from "./package-manager.js";
/** Re-exported API for src/agents/sessions, starting with Prompt Template. */
export type { PromptTemplate } from "./prompt-templates.js";
/** Re-exported API for src/agents/sessions, starting with Resource Collision. */
export type { ResourceCollision, ResourceDiagnostic } from "./diagnostics.js";
export * from "./session-manager.js";
/** Re-exported API for src/agents/sessions. */
export {
  FileSettingsStorage,
  InMemorySettingsStorage,
  SettingsManager,
  type BranchSummarySettings,
  type ImageSettings,
  type MarkdownSettings,
  type PackageSource,
  type ProviderRetrySettings,
  type RetrySettings,
  type Settings,
  type SettingsError,
  type SettingsScope,
  type SettingsStorage,
  type TerminalSettings,
  type ThinkingBudgetsSettings,
  type TransportSetting,
  type WarningSettings,
} from "./settings-manager.js";
/** Re-exported API for src/agents/sessions, starting with Skill. */
export type { Skill } from "../../skills/loading/session.js";
export * from "./source-info.js";
export * from "./tools/index.js";
/** Shared type for this surface in src/agents/sessions. */
export type * from "./extensions/types.js";
/** Re-exported API for src/agents/sessions. */
export {
  defineTool,
  isBashToolResult,
  isEditToolResult,
  isFindToolResult,
  isGrepToolResult,
  isLsToolResult,
  isReadToolResult,
  isToolCallEventType,
  isWriteToolResult,
} from "./extensions/types.js";
/** Re-exported API for src/agents/sessions, starting with wrap Registered Tool. */
export { wrapRegisteredTool, wrapRegisteredTools } from "./extensions/wrapper.js";
