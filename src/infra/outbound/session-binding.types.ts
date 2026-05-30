// Session binding contracts shared by channel adapters and outbound routing.
/** Target kind stored by a conversation binding. */
export type BindingTargetKind = "subagent" | "session";
/** Lifecycle status of a session binding. */
export type BindingStatus = "active" | "ending" | "ended";
/** Where a binding may be created relative to the current conversation. */
export type SessionBindingPlacement = "current" | "child";
/** Stable error codes returned by binding operations. */
export type SessionBindingErrorCode =
  | "BINDING_ADAPTER_UNAVAILABLE"
  | "BINDING_CAPABILITY_UNSUPPORTED"
  | "BINDING_CREATE_FAILED";

/** Channel conversation identity used for binding lookups. */
export type ConversationRef = {
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
};

/** Persisted or adapter-provided binding record. */
export type SessionBindingRecord = {
  bindingId: string;
  targetSessionKey: string;
  targetKind: BindingTargetKind;
  conversation: ConversationRef;
  status: BindingStatus;
  boundAt: number;
  expiresAt?: number;
  metadata?: Record<string, unknown>;
};

/** Input required to bind a conversation to a target session. */
export type SessionBindingBindInput = {
  targetSessionKey: string;
  targetKind: BindingTargetKind;
  conversation: ConversationRef;
  placement?: SessionBindingPlacement;
  metadata?: Record<string, unknown>;
  ttlMs?: number;
};

/** Input used to unbind by binding id or target session key. */
export type SessionBindingUnbindInput = {
  bindingId?: string;
  targetSessionKey?: string;
  reason: string;
};

/** Capabilities advertised by a channel binding adapter. */
export type SessionBindingCapabilities = {
  adapterAvailable: boolean;
  bindSupported: boolean;
  unbindSupported: boolean;
  placements: SessionBindingPlacement[];
};
