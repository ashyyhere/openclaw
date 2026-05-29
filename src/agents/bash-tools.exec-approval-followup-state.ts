/** Runtime handoff state for exec approval follow-up runs. */
import { randomUUID } from "node:crypto";
import {
  isFutureDateTimestampMs,
  resolveExpiresAtMsFromDurationMs,
} from "../shared/number-coercion.js";
import { normalizeOptionalString } from "../shared/string-coerce.js";
import type { ExecElevatedDefaults } from "./bash-tools.exec-types.js";

const EXEC_APPROVAL_FOLLOWUP_IDEMPOTENCY_PREFIX = "exec-approval-followup:";
const EXEC_APPROVAL_FOLLOWUP_IDEMPOTENCY_NONCE_MARKER = ":nonce:";
const EXEC_APPROVAL_FOLLOWUP_RUNTIME_HANDOFF_TTL_MS = 5 * 60 * 1000;

/** Shared type for Exec Approval Followup Runtime Handoff in src/agents. */
export type ExecApprovalFollowupRuntimeHandoff = {
  kind: "exec-approval-followup";
  approvalId: string;
  sessionKey: string;
  idempotencyKey: string;
  bashElevated: ExecElevatedDefaults;
};

/** Shared type for Exec Approval Followup Runtime Handoff Registration in src/agents. */
export type ExecApprovalFollowupRuntimeHandoffRegistration = {
  handoffId: string;
  idempotencyKey: string;
};

type ExecApprovalFollowupRuntimeHandoffEntry = ExecApprovalFollowupRuntimeHandoff & {
  expiresAtMs: number;
};

const execApprovalFollowupRuntimeHandoffs = new Map<
  string,
  ExecApprovalFollowupRuntimeHandoffEntry
>();

function cloneExecElevatedDefaults(value: ExecElevatedDefaults): ExecElevatedDefaults {
  return {
    enabled: value.enabled,
    allowed: value.allowed,
    defaultLevel: value.defaultLevel,
    ...(value.fullAccessAvailable !== undefined
      ? { fullAccessAvailable: value.fullAccessAvailable }
      : {}),
    ...(value.fullAccessBlockedReason !== undefined
      ? { fullAccessBlockedReason: value.fullAccessBlockedReason }
      : {}),
  };
}

function cloneExecApprovalFollowupRuntimeHandoff(
  value: ExecApprovalFollowupRuntimeHandoff,
): ExecApprovalFollowupRuntimeHandoff {
  return {
    kind: value.kind,
    approvalId: value.approvalId,
    sessionKey: value.sessionKey,
    idempotencyKey: value.idempotencyKey,
    bashElevated: cloneExecElevatedDefaults(value.bashElevated),
  };
}

function pruneExpiredExecApprovalFollowupRuntimeHandoffs(nowMs: number): void {
  for (const [handoffId, entry] of execApprovalFollowupRuntimeHandoffs) {
    if (!isFutureDateTimestampMs(entry.expiresAtMs, { nowMs })) {
      execApprovalFollowupRuntimeHandoffs.delete(handoffId);
    }
  }
}

/** Build an idempotency key for an exec approval follow-up. */
export function buildExecApprovalFollowupIdempotencyKey(params: {
  approvalId: string;
  nonce?: string;
}): string {
  const base = `${EXEC_APPROVAL_FOLLOWUP_IDEMPOTENCY_PREFIX}${params.approvalId}`;
  const nonce = normalizeOptionalString(params.nonce);
  return nonce ? `${base}${EXEC_APPROVAL_FOLLOWUP_IDEMPOTENCY_NONCE_MARKER}${nonce}` : base;
}

/** Parse the approval id from a follow-up idempotency key. */
export function parseExecApprovalFollowupApprovalId(idempotencyKey: string): string | undefined {
  const normalized = normalizeOptionalString(idempotencyKey);
  if (!normalized?.startsWith(EXEC_APPROVAL_FOLLOWUP_IDEMPOTENCY_PREFIX)) {
    return undefined;
  }
  const body = normalized.slice(EXEC_APPROVAL_FOLLOWUP_IDEMPOTENCY_PREFIX.length);
  const nonceMarker = body.lastIndexOf(EXEC_APPROVAL_FOLLOWUP_IDEMPOTENCY_NONCE_MARKER);
  return normalizeOptionalString(nonceMarker >= 0 ? body.slice(0, nonceMarker) : body);
}

/** Register a short-lived runtime handoff for an approval follow-up. */
export function registerExecApprovalFollowupRuntimeHandoff(params: {
  approvalId: string;
  sessionKey: string;
  bashElevated?: ExecElevatedDefaults;
  nowMs?: number;
}): ExecApprovalFollowupRuntimeHandoffRegistration | undefined {
  const approvalId = normalizeOptionalString(params.approvalId);
  const sessionKey = normalizeOptionalString(params.sessionKey);
  if (!approvalId || !sessionKey || !params.bashElevated) {
    return undefined;
  }
  const nowMs = params.nowMs ?? Date.now();
  pruneExpiredExecApprovalFollowupRuntimeHandoffs(nowMs);
  const expiresAtMs = resolveExpiresAtMsFromDurationMs(
    EXEC_APPROVAL_FOLLOWUP_RUNTIME_HANDOFF_TTL_MS,
    { nowMs },
  );
  if (expiresAtMs === undefined) {
    return undefined;
  }
  const handoffId = randomUUID();
  const idempotencyKey = buildExecApprovalFollowupIdempotencyKey({
    approvalId,
    nonce: randomUUID(),
  });
  execApprovalFollowupRuntimeHandoffs.set(handoffId, {
    kind: "exec-approval-followup",
    approvalId,
    sessionKey,
    idempotencyKey,
    bashElevated: cloneExecElevatedDefaults(params.bashElevated),
    expiresAtMs,
  });
  return { handoffId, idempotencyKey };
}

/** Consume a registered exec approval follow-up handoff exactly once. */
export function consumeExecApprovalFollowupRuntimeHandoff(params: {
  handoffId?: string;
  approvalId?: string;
  idempotencyKey?: string;
  sessionKey?: string;
  nowMs?: number;
}): ExecApprovalFollowupRuntimeHandoff | undefined {
  const handoffId = normalizeOptionalString(params.handoffId);
  const approvalId = normalizeOptionalString(params.approvalId);
  const idempotencyKey = normalizeOptionalString(params.idempotencyKey);
  if (!handoffId || !approvalId || !idempotencyKey) {
    return undefined;
  }
  const nowMs = params.nowMs ?? Date.now();
  pruneExpiredExecApprovalFollowupRuntimeHandoffs(nowMs);
  const entry = execApprovalFollowupRuntimeHandoffs.get(handoffId);
  if (!entry) {
    return undefined;
  }
  if (!isFutureDateTimestampMs(entry.expiresAtMs, { nowMs })) {
    execApprovalFollowupRuntimeHandoffs.delete(handoffId);
    return undefined;
  }
  const sessionKey = normalizeOptionalString(params.sessionKey);
  if (
    entry.approvalId !== approvalId ||
    entry.idempotencyKey !== idempotencyKey ||
    entry.sessionKey !== sessionKey
  ) {
    return undefined;
  }
  execApprovalFollowupRuntimeHandoffs.delete(handoffId);
  return cloneExecApprovalFollowupRuntimeHandoff(entry);
}

/** Reset exec approval follow-up handoff state between tests. */
export function resetExecApprovalFollowupRuntimeHandoffsForTests(): void {
  execApprovalFollowupRuntimeHandoffs.clear();
}
