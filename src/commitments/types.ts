// Public commitment domain types shared by extraction, storage, and heartbeat delivery.
/** Category of follow-up opportunity inferred from a conversation turn. */
export type CommitmentKind = "event_check_in" | "deadline_check" | "care_check_in" | "open_loop";

/** Sensitivity bucket used to tune confidence thresholds and delivery tone. */
export type CommitmentSensitivity = "routine" | "personal" | "care";

/** Lifecycle state for an inferred commitment record. */
export type CommitmentStatus = "pending" | "sent" | "dismissed" | "snoozed" | "expired";

/** Origin of a commitment candidate. */
export type CommitmentSource = "inferred_user_context" | "agent_promise";

/** Conversation scope that owns a commitment and determines delivery routing. */
export type CommitmentScope = {
  agentId: string;
  sessionKey: string;
  channel: string;
  accountId?: string;
  to?: string;
  threadId?: string;
  senderId?: string;
};

/** Earliest/latest delivery window in epoch milliseconds plus display timezone. */
export type CommitmentDueWindow = {
  earliestMs: number;
  latestMs: number;
  timezone: string;
};

/** Persisted commitment record with routing scope, delivery state, and source metadata. */
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

/** Versioned JSON file shape for the commitment store. */
export type CommitmentStoreFile = {
  version: 1;
  commitments: CommitmentRecord[];
};

/** Model-produced candidate before validation and persistence. */
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

/** Hidden extraction input built from one conversation turn and existing pending context. */
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

/** Parsed commitment extraction result for a batch of items. */
export type CommitmentExtractionBatchResult = {
  candidates: CommitmentCandidate[];
};
