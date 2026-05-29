/** Shared health summary types used by health and status commands. */
export type ChannelAccountHealthSummary = {
  accountId: string;
  configured?: boolean;
  linked?: boolean;
  authAgeMs?: number | null;
  probe?: unknown;
  lastProbeAt?: number | null;
  [key: string]: unknown;
};

/** Shared type for Channel Health Summary in src/commands. */
export type ChannelHealthSummary = ChannelAccountHealthSummary & {
  accounts?: Record<string, ChannelAccountHealthSummary>;
};

/** Shared type for Agent Health Summary in src/commands. */
export type AgentHealthSummary = {
  agentId: string;
  name?: string;
  isDefault: boolean;
  heartbeat: import("../infra/heartbeat-summary.js").HeartbeatSummary;
  sessions: HealthSummary["sessions"];
};

/** Shared type for Plugin Health Error Summary in src/commands. */
export type PluginHealthErrorSummary = {
  id: string;
  origin: string;
  activated: boolean;
  activationSource?: string;
  activationReason?: string;
  failurePhase?: string;
  error: string;
};

/** Shared type for Plugin Health Summary in src/commands. */
export type PluginHealthSummary = {
  loaded: string[];
  errors: PluginHealthErrorSummary[];
};

/** Shared type for Context Engine Health Quarantine Summary in src/commands. */
export type ContextEngineHealthQuarantineSummary = {
  engineId: string;
  owner?: string;
  operation: string;
  reason: string;
  failedAt: number;
};

/** Shared type for Context Engine Health Summary in src/commands. */
export type ContextEngineHealthSummary = {
  quarantined: ContextEngineHealthQuarantineSummary[];
};

/** Shared type for Model Pricing Health Summary in src/commands. */
export type ModelPricingHealthSummary =
  import("../gateway/model-pricing-cache-state.js").GatewayModelPricingHealth;

/** Shared type for Health Summary in src/commands. */
export type HealthSummary = {
  ok: true;
  ts: number;
  durationMs: number;
  eventLoop?: import("../gateway/server/event-loop-health.js").GatewayEventLoopHealth;
  plugins?: PluginHealthSummary;
  contextEngines?: ContextEngineHealthSummary;
  modelPricing?: ModelPricingHealthSummary;
  channels: Record<string, ChannelHealthSummary>;
  channelOrder: string[];
  channelLabels: Record<string, string>;
  heartbeatSeconds: number;
  defaultAgentId: string;
  agents: AgentHealthSummary[];
  sessions: {
    path: string;
    count: number;
    recent: Array<{
      key: string;
      updatedAt: number | null;
      age: number | null;
    }>;
  };
};
