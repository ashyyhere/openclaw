// Plugin runtime public types. Native plugins receive this trusted in-process
// surface for subagent runs, remote node invocation, logging, core, and channel APIs.
import type { PluginRuntimeChannel } from "./types-channel.js";
import type { PluginRuntimeCore, RuntimeLogger } from "./types-core.js";

/** Logger contract re-exported with the plugin runtime surface. */
export type { RuntimeLogger };

// ── Subagent runtime types ──────────────────────────────────────────

/** Parameters for starting a subagent run from a plugin. */
export type SubagentRunParams = {
  sessionKey: string;
  message: string;
  provider?: string;
  model?: string;
  extraSystemPrompt?: string;
  lane?: string;
  lightContext?: boolean;
  deliver?: boolean;
  idempotencyKey?: string;
};

/** Identifier returned after a subagent run is accepted. */
export type SubagentRunResult = {
  runId: string;
};

/** Parameters for waiting on a previously started subagent run. */
export type SubagentWaitParams = {
  runId: string;
  timeoutMs?: number;
};

/** Completion status returned by subagent wait operations. */
export type SubagentWaitResult = {
  status: "ok" | "error" | "timeout";
  error?: string;
};

/** Parameters for reading recent messages from a subagent session. */
export type SubagentGetSessionMessagesParams = {
  sessionKey: string;
  limit?: number;
};

/** Messages returned from a subagent session read. */
export type SubagentGetSessionMessagesResult = {
  messages: unknown[];
};

/** @deprecated Use SubagentGetSessionMessagesParams. */
export type SubagentGetSessionParams = SubagentGetSessionMessagesParams;

/** @deprecated Use SubagentGetSessionMessagesResult. */
export type SubagentGetSessionResult = SubagentGetSessionMessagesResult;

/** Parameters for deleting a subagent session and optionally its transcript. */
export type SubagentDeleteSessionParams = {
  sessionKey: string;
  deleteTranscript?: boolean;
};

/** Optional filter for listing runtime-connected nodes. */
export type RuntimeNodeListParams = {
  connected?: boolean;
};

/** Nodes visible to the plugin runtime. */
export type RuntimeNodeListResult = {
  nodes: Array<{
    nodeId: string;
    displayName?: string;
    remoteIp?: string;
    connected?: boolean;
    caps?: string[];
    commands?: string[];
  }>;
};

/** Remote node command invocation request. */
export type RuntimeNodeInvokeParams = {
  nodeId: string;
  command: string;
  params?: unknown;
  timeoutMs?: number;
  idempotencyKey?: string;
};

/** Trusted in-process runtime surface injected into native plugins. */
export type PluginRuntime = PluginRuntimeCore & {
  subagent: {
    run: (params: SubagentRunParams) => Promise<SubagentRunResult>;
    waitForRun: (params: SubagentWaitParams) => Promise<SubagentWaitResult>;
    getSessionMessages: (
      params: SubagentGetSessionMessagesParams,
    ) => Promise<SubagentGetSessionMessagesResult>;
    /** @deprecated Use getSessionMessages. */
    getSession: (params: SubagentGetSessionParams) => Promise<SubagentGetSessionResult>;
    deleteSession: (params: SubagentDeleteSessionParams) => Promise<void>;
  };
  nodes: {
    list: (params?: RuntimeNodeListParams) => Promise<RuntimeNodeListResult>;
    invoke: (params: RuntimeNodeInvokeParams) => Promise<unknown>;
  };
  channel: PluginRuntimeChannel;
};

/** Optional runtime bindings used when constructing a plugin runtime. */
export type CreatePluginRuntimeOptions = {
  subagent?: PluginRuntime["subagent"];
  nodes?: PluginRuntime["nodes"];
  allowGatewaySubagentBinding?: boolean;
};
