/** Public types for plugin middleware that can inspect or rewrite tool results. */
import type { AgentToolResult } from "../agents/runtime/index.js";

/** Tool result shape exposed to plugin result middleware. */
export type OpenClawAgentToolResult<TResult = unknown> = AgentToolResult<TResult>;

/** Runtime families that can invoke plugin tool-result middleware. */
export type AgentToolResultMiddlewareRuntime = "openclaw" | "codex";
/** @deprecated Use AgentToolResultMiddlewareRuntime. */
export type AgentToolResultMiddlewareHarness =
  | AgentToolResultMiddlewareRuntime
  | "codex-app-server";

/** Tool-call event payload passed into result middleware. */
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

/** Runtime/session context passed alongside a tool-result middleware event. */
export type AgentToolResultMiddlewareContext = {
  runtime: AgentToolResultMiddlewareRuntime;
  /** @deprecated Use runtime. */
  harness?: AgentToolResultMiddlewareRuntime;
  agentId?: string;
  sessionId?: string;
  sessionKey?: string;
  runId?: string;
};

/** Optional replacement result returned by tool-result middleware. */
export type AgentToolResultMiddlewareResult = {
  result: OpenClawAgentToolResult;
};

/** Middleware callback that can observe or replace an agent tool result. */
export type AgentToolResultMiddleware = (
  event: AgentToolResultMiddlewareEvent,
  ctx: AgentToolResultMiddlewareContext,
) => Promise<AgentToolResultMiddlewareResult | void> | AgentToolResultMiddlewareResult | void;

/** Registration options that scope middleware to runtime families. */
export type AgentToolResultMiddlewareOptions = {
  runtimes?: AgentToolResultMiddlewareRuntime[];
  /** @deprecated Use runtimes. */
  harnesses?: AgentToolResultMiddlewareHarness[];
};
