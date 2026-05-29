// Crestodian config contracts for gated remote message rescue.
type CrestodianRescueConfig = {
  /**
   * Remote message rescue gate.
   * "auto" enables only for YOLO host posture with sandboxing off.
   */
  enabled?: "auto" | boolean;
  /** Restrict rescue to owner DMs. Default: true. */
  ownerDmOnly?: boolean;
  /** Pending write approval TTL in minutes. Default: 15. */
  pendingTtlMinutes?: number;
};

/** Top-level Crestodian config block. */
export type CrestodianConfig = {
  rescue?: CrestodianRescueConfig;
};
