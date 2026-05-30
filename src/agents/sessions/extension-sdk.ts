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
/** Footer data provider type exposed without pulling in session runtime internals. */
export type { ReadonlyFooterDataProvider } from "./footer-data-provider.js";
/** Message conversion helper used by extensions that need model-format payloads. */
export { convertToLlm } from "./messages.js";
export * from "./model-registry.js";
export * from "./model-resolver.js";
export * from "./package-manager.js";
/** Prompt template shape shared with extension-provided prompt resources. */
export type { PromptTemplate } from "./prompt-templates.js";
/** Diagnostic types surfaced when extension resources collide. */
export type { ResourceCollision, ResourceDiagnostic } from "./diagnostics.js";
export * from "./session-manager.js";
/** Settings manager surface safe for extension SDK consumers. */
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
/** Loaded skill metadata shape exposed to extension session APIs. */
export type { Skill } from "../../skills/loading/session.js";
export * from "./source-info.js";
export * from "./tools/index.js";
/** Extension tool and event types exported as type-only SDK surface. */
export type * from "./extensions/types.js";
/** Runtime extension tool guards and builders exposed through the SDK barrel. */
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
/** Wraps registered extension tools for the session tool execution surface. */
export { wrapRegisteredTool, wrapRegisteredTools } from "./extensions/wrapper.js";
