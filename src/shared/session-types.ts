// Shared gateway session/agent DTO base types used by core, TUI, and UI clients.
/** Agent identity fields surfaced through gateway session APIs. */
export type GatewayAgentIdentity = {
  name?: string;
  theme?: string;
  emoji?: string;
  avatar?: string;
  avatarUrl?: string;
};

/** Agent model selection summary surfaced through gateway session APIs. */
export type GatewayAgentModel = {
  primary?: string;
  fallbacks?: string[];
};

/** Agent runtime selection summary surfaced through gateway session APIs. */
export type GatewayAgentRuntime = {
  id: string;
  fallback?: "openclaw" | "none";
  source: "env" | "agent" | "defaults" | "model" | "provider" | "implicit" | "session-key";
};

/** Agent row base shared by gateway clients. */
export type GatewayAgentRow = {
  id: string;
  name?: string;
  identity?: GatewayAgentIdentity;
  workspace?: string;
  model?: GatewayAgentModel;
  agentRuntime?: GatewayAgentRuntime;
};

/** Generic base shape for paginated session-list gateway responses. */
export type SessionsListResultBase<TDefaults, TRow> = {
  ts: number;
  path: string;
  count: number;
  totalCount?: number;
  limitApplied?: number;
  offset?: number;
  nextOffset?: number | null;
  hasMore?: boolean;
  defaults: TDefaults;
  sessions: TRow[];
};

/** Generic base shape for successful session-patch gateway responses. */
export type SessionsPatchResultBase<TEntry> = {
  ok: true;
  path: string;
  key: string;
  entry: TEntry;
};
