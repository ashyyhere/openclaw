// Resolves commitments feature defaults and user timezone from OpenClaw config.
import { resolveUserTimezone } from "../agents/date-time.js";
import type { OpenClawConfig } from "../config/config.js";

const DEFAULT_COMMITMENT_EXTRACTION_DEBOUNCE_MS = 15_000;
const DEFAULT_COMMITMENT_BATCH_MAX_ITEMS = 8;
/** Reused constant for DEFAULT COMMITMENT EXTRACTION QUEUE MAX ITEMS behavior in src/commitments. */
export const DEFAULT_COMMITMENT_EXTRACTION_QUEUE_MAX_ITEMS = 64;
const DEFAULT_COMMITMENT_CONFIDENCE_THRESHOLD = 0.72;
const DEFAULT_COMMITMENT_CARE_CONFIDENCE_THRESHOLD = 0.86;
const DEFAULT_COMMITMENT_EXTRACTION_TIMEOUT_SECONDS = 45;
/** Reused constant for DEFAULT COMMITMENT MAX PER HEARTBEAT behavior in src/commitments. */
export const DEFAULT_COMMITMENT_MAX_PER_HEARTBEAT = 3;
/** Reused constant for DEFAULT COMMITMENT EXPIRE AFTER HOURS behavior in src/commitments. */
export const DEFAULT_COMMITMENT_EXPIRE_AFTER_HOURS = 72;
const DEFAULT_COMMITMENT_MAX_PER_DAY = 3;

type ResolvedCommitmentsConfig = {
  enabled: boolean;
  maxPerDay: number;
  extraction: {
    debounceMs: number;
    batchMaxItems: number;
    queueMaxItems: number;
    confidenceThreshold: number;
    careConfidenceThreshold: number;
    timeoutSeconds: number;
  };
};

function positiveInt(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : fallback;
}

/** Reused helper for resolve Commitments Config behavior in src/commitments. */
export function resolveCommitmentsConfig(cfg?: OpenClawConfig): ResolvedCommitmentsConfig {
  const raw = cfg?.commitments;
  return {
    enabled: raw?.enabled === true,
    maxPerDay: positiveInt(raw?.maxPerDay, DEFAULT_COMMITMENT_MAX_PER_DAY),
    extraction: {
      debounceMs: DEFAULT_COMMITMENT_EXTRACTION_DEBOUNCE_MS,
      batchMaxItems: DEFAULT_COMMITMENT_BATCH_MAX_ITEMS,
      queueMaxItems: DEFAULT_COMMITMENT_EXTRACTION_QUEUE_MAX_ITEMS,
      confidenceThreshold: DEFAULT_COMMITMENT_CONFIDENCE_THRESHOLD,
      careConfidenceThreshold: DEFAULT_COMMITMENT_CARE_CONFIDENCE_THRESHOLD,
      timeoutSeconds: DEFAULT_COMMITMENT_EXTRACTION_TIMEOUT_SECONDS,
    },
  };
}

/** Reused helper for resolve Commitment Timezone behavior in src/commitments. */
export function resolveCommitmentTimezone(cfg?: OpenClawConfig): string {
  return resolveUserTimezone(cfg?.agents?.defaults?.userTimezone);
}
