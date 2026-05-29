// Shared types for plugins/runtime types behavior.
import type { PluginRuntimeChannel } from "./types-channel.js";
import type { PluginRuntimeCore, RuntimeLogger } from "./types-core.js";

/** Re-exported API for src/plugins/runtime, starting with Runtime Logger. */
export type { RuntimeLogger };

// ── Subagent runtime types ──────────────────────────────────────────

/** Shared type for Subagent Run Params in src/plugins/runtime. */
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

/** Shared type for Subagent Run Result in src/plugins/runtime. */
export type SubagentRunResult = {
  runId: string;
};

/** Shared type for Subagent Wait Params in src/plugins/runtime. */
export type SubagentWaitParams = {
  runId: string;
  timeoutMs?: number;
};

/** Shared type for Subagent Wait Result in src/plugins/runtime. */
export type SubagentWaitResult = {
  status: "ok" | "error" | "timeout";
  error?: string;
};

/** Shared type for Subagent Get Session Messages Params in src/plugins/runtime. */
export type SubagentGetSessionMessagesParams = {
  sessionKey: string;
  limit?: number;
};

/** Shared type for Subagent Get Session Messages Result in src/plugins/runtime. */
export type SubagentGetSessionMessagesResult = {
  messages: unknown[];
};

/** @deprecated Use SubagentGetSessionMessagesParams. */
export type SubagentGetSessionParams = SubagentGetSessionMessagesParams;

/** @deprecated Use SubagentGetSessionMessagesResult. */
export type SubagentGetSessionResult = SubagentGetSessionMessagesResult;

/** Shared type for Subagent Delete Session Params in src/plugins/runtime. */
export type SubagentDeleteSessionParams = {
  sessionKey: string;
  deleteTranscript?: boolean;
};

/** Shared type for Runtime Node List Params in src/plugins/runtime. */
export type RuntimeNodeListParams = {
  connected?: boolean;
};

/** Shared type for Runtime Node List Result in src/plugins/runtime. */
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

/** Shared type for Runtime Node Invoke Params in src/plugins/runtime. */
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

/** Shared type for Create Plugin Runtime Options in src/plugins/runtime. */
export type CreatePluginRuntimeOptions = {
  subagent?: PluginRuntime["subagent"];
  nodes?: PluginRuntime["nodes"];
  allowGatewaySubagentBinding?: boolean;
};
