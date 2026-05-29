/** Shared embedded-agent helper types. */
export type EmbeddedContextFile = { path: string; content: string };

/** Shared type for Failover Reason in src/agents/embedded-agent-helpers. */
export type FailoverReason =
  | "auth"
  | "auth_permanent"
  | "format"
  | "rate_limit"
  | "overloaded"
  | "billing"
  | "server_error"
  | "timeout"
  | "model_not_found"
  | "session_expired"
  | "empty_response"
  | "no_error_details"
  | "unclassified"
  | "unknown";
