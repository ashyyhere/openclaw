// plugins agent tool result middleware types helpers and runtime behavior.
import type { AgentToolResult } from "../agents/runtime/index.js";

/** Shared type for Open Claw Agent Tool Result in src/plugins. */
export type OpenClawAgentToolResult<TResult = unknown> = AgentToolResult<TResult>;

/** Shared type for Agent Tool Result Middleware Runtime in src/plugins. */
export type AgentToolResultMiddlewareRuntime = "openclaw" | "codex";
/** @deprecated Use AgentToolResultMiddlewareRuntime. */
export type AgentToolResultMiddlewareHarness =
  | AgentToolResultMiddlewareRuntime
  | "codex-app-server";

/** Shared type for Agent Tool Result Middleware Event in src/plugins. */
export type AgentToolResultMiddlewareEvent = {
  threadId?: string;
  turnId?: string;
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  cwd?: string;
  isError?: boolean;
  result: OpenClawAgentToolResult;
};

/** Shared type for Agent Tool Result Middleware Context in src/plugins. */
export type AgentToolResultMiddlewareContext = {
  runtime: AgentToolResultMiddlewareRuntime;
  /** @deprecated Use runtime. */
  harness?: AgentToolResultMiddlewareRuntime;
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  runId?: string;
};

/** Shared type for Agent Tool Result Middleware Result in src/plugins. */
export type AgentToolResultMiddlewareResult = {
  result: OpenClawAgentToolResult;
};

/** Shared type for Agent Tool Result Middleware in src/plugins. */
export type AgentToolResultMiddleware = (
  event: AgentToolResultMiddlewareEvent,
  ctx: AgentToolResultMiddlewareContext,
) => Promise<AgentToolResultMiddlewareResult | void> | AgentToolResultMiddlewareResult | void;

/** Shared type for Agent Tool Result Middleware Options in src/plugins. */
export type AgentToolResultMiddlewareOptions = {
  runtimes?: AgentToolResultMiddlewareRuntime[];
  /** @deprecated Use runtimes. */
  harnesses?: AgentToolResultMiddlewareHarness[];
};
