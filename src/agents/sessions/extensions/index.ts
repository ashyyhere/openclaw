/**
 * Extension system for lifecycle events and custom tools.
 */

/** Slash command metadata types exposed to extension authors. */
export type { SlashCommandInfo, SlashCommandSource } from "../slash-commands.js";
/** Source information type attached to extension-provided commands. */
export type { SourceInfo } from "../source-info.js";
/** Extension loader entrypoints used by the session runtime. */
export {
  createExtensionRuntime,
  discoverAndLoadExtensions,
  loadExtensionFromFactory,
  loadExtensions,
} from "./loader.js";
/** Extension runner handler types for session lifecycle hooks. */
export type {
  ExtensionErrorListener,
  ForkHandler,
  NavigateTreeHandler,
  NewSessionHandler,
  ShutdownHandler,
  SwitchSessionHandler,
} from "./runner.js";
/** Extension runner implementation used by session hosts. */
export { ExtensionRunner } from "./runner.js";
/** Public extension event, API, tool, and UI context types. */
export type {
  AfterProviderResponseEvent,
  AgentEndEvent,
  AgentStartEvent,
  // Re-exports
  AgentToolResult,
  AgentToolUpdateCallback,
  AppendEntryHandler,
  // App keybindings (for custom editors)
  AppKeybinding,
  AutocompleteProviderFactory,
  // Events - Tool (ToolCallEvent types)
  BashToolCallEvent,
  BashToolResultEvent,
  BeforeAgentStartEvent,
  BeforeAgentStartEventResult,
  BeforeProviderRequestEvent,
  BeforeProviderRequestEventResult,
  BuildSystemPromptOptions,
  // Context
  CompactOptions,
  // Events - Agent
  ContextEvent,
  // Event Results
  ContextEventResult,
  ContextUsage,
  CustomToolCallEvent,
  CustomToolResultEvent,
  EditorFactory,
  EditToolCallEvent,
  EditToolResultEvent,
  ExecOptions,
  ExecResult,
  Extension,
  ExtensionActions,
  // API
  ExtensionAPI,
  ExtensionCommandContext,
  ExtensionCommandContextActions,
  ExtensionContext,
  ExtensionContextActions,
  // Errors
  ExtensionError,
  ExtensionEvent,
  ExtensionFactory,
  ExtensionFlag,
  ExtensionHandler,
  // Runtime
  ExtensionRuntime,
  ExtensionShortcut,
  ExtensionUIContext,
  ExtensionUIDialogOptions,
  ExtensionWidgetOptions,
  FindToolCallEvent,
  FindToolResultEvent,
  GetActiveToolsHandler,
  GetAllToolsHandler,
  GetCommandsHandler,
  GetThinkingLevelHandler,
  GrepToolCallEvent,
  GrepToolResultEvent,
  // Events - Input
  InputEvent,
  InputEventResult,
  InputSource,
  KeybindingsManager,
  LoadExtensionsResult,
  LsToolCallEvent,
  LsToolResultEvent,
  // Events - Message
  MessageEndEvent,
  // Message Rendering
  MessageRenderer,
  MessageRenderOptions,
  MessageStartEvent,
  MessageUpdateEvent,
  ModelSelectEvent,
  ModelSelectSource,
  // Provider Registration
  ProviderConfig,
  ProviderModelConfig,
  ReadToolCallEvent,
  ReadToolResultEvent,
  // Commands
  RegisteredCommand,
  RegisteredTool,
  ReplacedSessionContext,
  ResolvedCommand,
  // Events - Resources
  ResourcesDiscoverEvent,
  ResourcesDiscoverResult,
  SendMessageHandler,
  SendUserMessageHandler,
  SessionBeforeCompactEvent,
  SessionBeforeCompactResult,
  SessionBeforeForkEvent,
  SessionBeforeForkResult,
  SessionBeforeSwitchEvent,
  SessionBeforeSwitchResult,
  SessionBeforeTreeEvent,
  SessionBeforeTreeResult,
  SessionCompactEvent,
  SessionEvent,
  SessionShutdownEvent,
  // Events - Session
  SessionStartEvent,
  SessionTreeEvent,
  SetActiveToolsHandler,
  SetLabelHandler,
  SetModelHandler,
  SetThinkingLevelHandler,
  TerminalInputHandler,
  // Events - Tool
  ToolCallEvent,
  ToolCallEventResult,
  // Tools
  ToolDefinition,
  // Events - Tool Execution
  ToolExecutionEndEvent,
  // Tool execution mode
  ToolExecutionMode,
  ToolExecutionStartEvent,
  ToolExecutionUpdateEvent,
  ToolInfo,
  ToolRenderResultOptions,
  ToolResultEvent,
  ToolResultEventResult,
  TreePreparation,
  TurnEndEvent,
  TurnStartEvent,
  // Events - User Bash
  UserBashEvent,
  UserBashEventResult,
  WidgetPlacement,
  WorkingIndicatorOptions,
  WriteToolCallEvent,
  WriteToolResultEvent,
} from "./types.js";
// Type guards
/** Tool definition helpers and type guards exposed to extensions. */
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
} from "./types.js";
/** Wraps registered extension tools into runtime tool definitions. */
export { wrapRegisteredTool, wrapRegisteredTools } from "./wrapper.js";
