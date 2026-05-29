// config types crestodian helpers and runtime behavior.
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

/** Shared type for Crestodian Config in src/config. */
export type CrestodianConfig = {
  rescue?: CrestodianRescueConfig;
};
