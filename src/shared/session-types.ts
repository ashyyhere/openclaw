// shared session types helpers and runtime behavior.
/** Shared type for Gateway Agent Identity in src/shared. */
export type GatewayAgentIdentity = {
  name?: string;
  theme?: string;
  emoji?: string;
  avatar?: string;
  avatarUrl?: string;
};

/** Shared type for Gateway Agent Model in src/shared. */
export type GatewayAgentModel = {
  primary?: string;
  fallbacks?: string[];
};

/** Shared type for Gateway Agent Runtime in src/shared. */
export type GatewayAgentRuntime = {
  id: string;
  fallback?: "openclaw" | "none";
  source: "env" | "agent" | "defaults" | "model" | "provider" | "implicit" | "session-key";
};

/** Shared type for Gateway Agent Row in src/shared. */
export type GatewayAgentRow = {
  id: string;
  name?: string;
  identity?: GatewayAgentIdentity;
  workspace?: string;
  model?: GatewayAgentModel;
  agentRuntime?: GatewayAgentRuntime;
};

/** Shared type for Sessions List Result Base in src/shared. */
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

/** Shared type for Sessions Patch Result Base in src/shared. */
export type SessionsPatchResultBase<TEntry> = {
  ok: true;
  path: string;
  key: string;
  entry: TEntry;
};
