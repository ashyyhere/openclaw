// Shared types for infra/outbound session binding types behavior.
/** Shared type for Binding Target Kind in src/infra/outbound. */
export type BindingTargetKind = "subagent" | "session";
/** Shared type for Binding Status in src/infra/outbound. */
export type BindingStatus = "active" | "ending" | "ended";
/** Shared type for Session Binding Placement in src/infra/outbound. */
export type SessionBindingPlacement = "current" | "child";
/** Shared type for Session Binding Error Code in src/infra/outbound. */
export type SessionBindingErrorCode =
  | "BINDING_ADAPTER_UNAVAILABLE"
  | "BINDING_CAPABILITY_UNSUPPORTED"
  | "BINDING_CREATE_FAILED";

/** Shared type for Conversation Ref in src/infra/outbound. */
export type ConversationRef = {
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
};

/** Shared type for Session Binding Record in src/infra/outbound. */
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

/** Shared type for Session Binding Bind Input in src/infra/outbound. */
export type SessionBindingBindInput = {
  targetSessionKey: string;
  targetKind: BindingTargetKind;
  conversation: ConversationRef;
  placement?: SessionBindingPlacement;
  metadata?: Record<string, unknown>;
  ttlMs?: number;
};

/** Shared type for Session Binding Unbind Input in src/infra/outbound. */
export type SessionBindingUnbindInput = {
  bindingId?: string;
  targetSessionKey?: string;
  reason: string;
};

/** Shared type for Session Binding Capabilities in src/infra/outbound. */
export type SessionBindingCapabilities = {
  adapterAvailable: boolean;
  bindSupported: boolean;
  unbindSupported: boolean;
  placements: SessionBindingPlacement[];
};
