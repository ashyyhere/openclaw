import type { PluginJsonValue } from "./host-hook-json.js";

/** Placement of plugin-provided context in the next agent turn. */
export type PluginNextTurnInjectionPlacement = "prepend_context" | "append_context";

/** Request from a plugin to inject context into a future session turn. */
export type PluginNextTurnInjection = {
  sessionKey: string;
  text: string;
  idempotencyKey?: string;
  placement?: PluginNextTurnInjectionPlacement;
  ttlMs?: number;
  metadata?: PluginJsonValue;
};

/** Persisted plugin next-turn injection with owner and creation metadata. */
export type PluginNextTurnInjectionRecord = Omit<PluginNextTurnInjection, "sessionKey"> & {
  id: string;
  pluginId: string;
  pluginName?: string;
  createdAt: number;
  placement: PluginNextTurnInjectionPlacement;
};

/** Result returned after enqueueing a plugin next-turn injection. */
export type PluginNextTurnInjectionEnqueueResult = {
  enqueued: boolean;
  id: string;
  sessionKey: string;
};

/** Event passed to plugins before an agent turn prompt is finalized. */
export type PluginAgentTurnPrepareEvent = {
  prompt: string;
  messages: unknown[];
  queuedInjections: PluginNextTurnInjectionRecord[];
};

/** Context contributions returned by plugin agent-turn prepare hooks. */
export type PluginAgentTurnPrepareResult = {
  prependContext?: string;
  appendContext?: string;
};

/** Event passed to plugins that contribute heartbeat prompt context. */
export type PluginHeartbeatPromptContributionEvent = {
  sessionKey?: string;
  agentId?: string;
  heartbeatName?: string;
};

/** Context contributions returned by plugin heartbeat prompt hooks. */
export type PluginHeartbeatPromptContributionResult = {
  prependContext?: string;
  appendContext?: string;
};
