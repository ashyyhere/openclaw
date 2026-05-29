// Public commitment domain types shared by extraction, storage, and heartbeat delivery.
/** Shared type for Commitment Kind in src/commitments. */
export type CommitmentKind = "event_check_in" | "deadline_check" | "care_check_in" | "open_loop";

/** Shared type for Commitment Sensitivity in src/commitments. */
export type CommitmentSensitivity = "routine" | "personal" | "care";

/** Shared type for Commitment Status in src/commitments. */
export type CommitmentStatus = "pending" | "sent" | "dismissed" | "snoozed" | "expired";

/** Shared type for Commitment Source in src/commitments. */
export type CommitmentSource = "inferred_user_context" | "agent_promise";

/** Shared type for Commitment Scope in src/commitments. */
export type CommitmentScope = {
  agentId: string;
  sessionKey: string;
  channel: string;
  accountId?: string;
  to?: string;
  threadId?: string;
  senderId?: string;
};

/** Shared type for Commitment Due Window in src/commitments. */
export type CommitmentDueWindow = {
  earliestMs: number;
  latestMs: number;
  timezone: string;
};

/** Shared type for Commitment Record in src/commitments. */
export type CommitmentRecord = CommitmentScope & {
  id: string;
  kind: CommitmentKind;
  sensitivity: CommitmentSensitivity;
  source: CommitmentSource;
  status: CommitmentStatus;
  reason: string;
  suggestedText: string;
  dedupeKey: string;
  confidence: number;
  dueWindow: CommitmentDueWindow;
  sourceMessageId?: string;
  sourceRunId?: string;
  /** @deprecated Legacy-only field from early stores. Do not replay this into delivery prompts. */
  sourceUserText?: string;
  /** @deprecated Legacy-only field from early stores. Do not replay this into delivery prompts. */
  sourceAssistantText?: string;
  createdAtMs: number;
  updatedAtMs: number;
  attempts: number;
  lastAttemptAtMs?: number;
  sentAtMs?: number;
  dismissedAtMs?: number;
  snoozedUntilMs?: number;
  expiredAtMs?: number;
};

/** Shared type for Commitment Store File in src/commitments. */
export type CommitmentStoreFile = {
  version: 1;
  commitments: CommitmentRecord[];
};

/** Shared type for Commitment Candidate in src/commitments. */
export type CommitmentCandidate = {
  itemId: string;
  kind: CommitmentKind;
  sensitivity: CommitmentSensitivity;
  source: CommitmentSource;
  reason: string;
  suggestedText: string;
  dedupeKey: string;
  confidence: number;
  dueWindow: {
    earliest: string;
    latest?: string;
    timezone?: string;
  };
};

/** Shared type for Commitment Extraction Item in src/commitments. */
export type CommitmentExtractionItem = CommitmentScope & {
  itemId: string;
  nowMs: number;
  timezone: string;
  userText: string;
  assistantText?: string;
  sourceMessageId?: string;
  sourceRunId?: string;
  existingPending: Array<{
    kind: CommitmentKind;
    reason: string;
    dedupeKey: string;
    earliestMs: number;
    latestMs: number;
  }>;
};

/** Shared type for Commitment Extraction Batch Result in src/commitments. */
export type CommitmentExtractionBatchResult = {
  candidates: CommitmentCandidate[];
};
