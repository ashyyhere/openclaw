// config types commitments helpers and runtime behavior.
/** Shared type for Commitments Config in src/config. */
export type CommitmentsConfig = {
  /** Enable inferred follow-up extraction, storage, and heartbeat delivery. Default: false. */
  enabled?: boolean;
  /** Maximum inferred follow-up commitments delivered per agent session in a rolling day. Default: 3. */
  maxPerDay?: number;
};
