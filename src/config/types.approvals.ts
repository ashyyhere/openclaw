// config types approvals helpers and runtime behavior.
/** Shared type for Native Exec Approval Enable Mode in src/config. */
export type NativeExecApprovalEnableMode = boolean | "auto";

/** Shared type for Exec Approval Forwarding Mode in src/config. */
export type ExecApprovalForwardingMode = "session" | "targets" | "both";

/** Shared type for Exec Approval Forward Target in src/config. */
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

/** Shared type for Exec Approval Forwarding Config in src/config. */
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

/** Shared type for Approvals Config in src/config. */
export type ApprovalsConfig = {
  exec?: ExecApprovalForwardingConfig;
  plugin?: ExecApprovalForwardingConfig;
};
