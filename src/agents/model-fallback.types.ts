/** Shared model fallback candidate and attempt types. */
import type { FailoverReason } from "./embedded-agent-helpers/types.js";

/** Provider/model candidate considered by fallback. */
export type ModelCandidate = {
  provider: string;
  model: string;
};

/** Recorded failed fallback attempt. */
export type FallbackAttempt = {
  provider: string;
  model: string;
  error: string;
  reason?: FailoverReason;
  status?: number;
  code?: string;
};
