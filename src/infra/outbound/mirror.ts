// infra/outbound mirror helpers and runtime behavior.
/** Shared type for Outbound Mirror in src/infra/outbound. */
export type OutboundMirror = {
  sessionKey: string;
  agentId?: string;
  text?: string;
  mediaUrls?: string[];
  idempotencyKey?: string;
};

/** Shared type for Delivery Mirror in src/infra/outbound. */
export type DeliveryMirror = OutboundMirror & {
  /** Whether this message is being sent in a group/channel context */
  isGroup?: boolean;
  /** Group or channel identifier for correlation with received events */
  groupId?: string;
};
