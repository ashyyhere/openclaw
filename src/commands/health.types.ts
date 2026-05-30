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

/** Channel health rollup, optionally keyed by account id for multi-account channels. */
export type ChannelHealthSummary = ChannelAccountHealthSummary & {
  accounts?: Record<string, ChannelAccountHealthSummary>;
};

/** Agent-level health summary rendered by health and status commands. */
export type AgentHealthSummary = {
  agentId: string;
  name?: string;
  isDefault: boolean;
  heartbeat: import("../infra/heartbeat-summary.js").HeartbeatSummary;
  sessions: HealthSummary["sessions"];
};

/** Plugin activation or loading failure shown in health output. */
export type PluginHealthErrorSummary = {
  id: string;
  origin: string;
  activated: boolean;
  activationSource?: string;
  activationReason?: string;
  failurePhase?: string;
  error: string;
};

/** Loaded plugin ids and activation errors collected for health output. */
export type PluginHealthSummary = {
  loaded: string[];
  errors: PluginHealthErrorSummary[];
};

/** Context engine quarantine record included in health diagnostics. */
export type ContextEngineHealthQuarantineSummary = {
  engineId: string;
  owner?: string;
  operation: string;
  reason: string;
  failedAt: number;
};

/** Context engine health section for quarantined engines. */
export type ContextEngineHealthSummary = {
  quarantined: ContextEngineHealthQuarantineSummary[];
};

/** Gateway model-pricing cache health section. */
export type ModelPricingHealthSummary =
  import("../gateway/model-pricing-cache-state.js").GatewayModelPricingHealth;

/** Complete JSON health summary returned by health/status surfaces. */
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
