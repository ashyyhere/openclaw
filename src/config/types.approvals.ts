// Approval forwarding config contracts for exec and plugin approvals.
/** Enablement mode for native exec approval delivery. */
export type NativeExecApprovalEnableMode = boolean | "auto";

/** Delivery fanout mode for forwarded approvals. */
export type ExecApprovalForwardingMode = "session" | "targets" | "both";

/** Explicit chat target for forwarded approval prompts. */
export type ExecApprovalForwardTarget = {
  /** Channel id (e.g. "discord", "slack", or plugin channel id). */
  channel: string;
  /** Destination id (channel id, user id, etc. depending on channel). */
  to: string;
  /** Optional account id for multi-account channels. */
  accountId?: string;
  /** Optional thread id to reply inside a thread. */
  threadId?: string | number;
};

/** Approval forwarding filters and destination config. */
export type ExecApprovalForwardingConfig = {
  /** Enable forwarding exec approvals to chat channels. Default: false. */
  enabled?: boolean;
  /** Delivery mode (session=origin chat, targets=config targets, both=both). Default: session. */
  mode?: ExecApprovalForwardingMode;
  /** Only forward approvals for these agent IDs. Omit = all agents. */
  agentFilter?: string[];
  /** Only forward approvals matching these session key patterns (substring or regex). */
  sessionFilter?: string[];
  /** Explicit delivery targets (used when mode includes targets). */
  targets?: ExecApprovalForwardTarget[];
};

/** Top-level approval forwarding config by approval family. */
export type ApprovalsConfig = {
  exec?: ExecApprovalForwardingConfig;
  plugin?: ExecApprovalForwardingConfig;
};
