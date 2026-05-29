import type { PluginJsonValue } from "./host-hook-json.js";

/** Shared type for Plugin Next Turn Injection Placement in src/plugins. */
export type PluginNextTurnInjectionPlacement = "prepend_context" | "append_context";

/** Shared type for Plugin Next Turn Injection in src/plugins. */
export type PluginNextTurnInjection = {
  sessionKey: string;
  text: string;
  idempotencyKey?: string;
  placement?: PluginNextTurnInjectionPlacement;
  ttlMs?: number;
  metadata?: PluginJsonValue;
};

/** Shared type for Plugin Next Turn Injection Record in src/plugins. */
export type PluginNextTurnInjectionRecord = Omit<PluginNextTurnInjection, "sessionKey"> & {
  id: string;
  pluginId: string;
  pluginName?: string;
  createdAt: number;
  placement: PluginNextTurnInjectionPlacement;
};

/** Shared type for Plugin Next Turn Injection Enqueue Result in src/plugins. */
export type PluginNextTurnInjectionEnqueueResult = {
  enqueued: boolean;
  id: string;
  sessionKey: string;
};

/** Shared type for Plugin Agent Turn Prepare Event in src/plugins. */
export type PluginAgentTurnPrepareEvent = {
  prompt: string;
  messages: unknown[];
  queuedInjections: PluginNextTurnInjectionRecord[];
};

/** Shared type for Plugin Agent Turn Prepare Result in src/plugins. */
export type PluginAgentTurnPrepareResult = {
  prependContext?: string;
  appendContext?: string;
};

/** Shared type for Plugin Heartbeat Prompt Contribution Event in src/plugins. */
export type PluginHeartbeatPromptContributionEvent = {
  sessionKey?: string;
  agentId?: string;
  heartbeatName?: string;
};

/** Shared type for Plugin Heartbeat Prompt Contribution Result in src/plugins. */
export type PluginHeartbeatPromptContributionResult = {
  prependContext?: string;
  appendContext?: string;
};
