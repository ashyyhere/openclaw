// plugins codex app server extension types helpers and runtime behavior.
import type { AgentToolResult } from "../agents/runtime/index.js";

/** Shared type for Codex App Server Tool Result Event in src/plugins. */
export type CodexAppServerToolResultEvent = {
  threadId: string;
  turnId: string;
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result: AgentToolResult<unknown>;
};

/** Shared type for Codex App Server Extension Context in src/plugins. */
export type CodexAppServerExtensionContext = {
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  runId?: string;
};

/** Shared type for Codex App Server Tool Result Handler Result in src/plugins. */
export type CodexAppServerToolResultHandlerResult = {
  result: AgentToolResult<unknown>;
};

/** Shared type for Codex App Server Extension Runtime in src/plugins. */
export type CodexAppServerExtensionRuntime = {
  on: (
    event: "tool_result",
    handler: (
      event: CodexAppServerToolResultEvent,
      ctx: CodexAppServerExtensionContext,
    ) =>
      | Promise<CodexAppServerToolResultHandlerResult | void>
      | CodexAppServerToolResultHandlerResult
      | void,
  ) => void;
};

/** Shared type for Codex App Server Extension Factory in src/plugins. */
export type CodexAppServerExtensionFactory = (
  runtime: CodexAppServerExtensionRuntime,
) => Promise<void> | void;
