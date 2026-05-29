/** Shared exec approval/result helpers used by gateway and node hosts. */
import crypto from "node:crypto";
import { formatErrorMessage } from "../infra/errors.js";
import { buildExecApprovalUnavailableReplyPayload } from "../infra/exec-approval-reply.js";
import {
  type ExecApprovalInitiatingSurfaceState,
  resolveExecApprovalInitiatingSurfaceState,
} from "../infra/exec-approval-surface.js";
import {
  minSecurity,
  maxAsk,
  resolveExecApprovalAllowedDecisions,
  resolveExecApprovals,
  type ExecAsk,
  type ExecApprovalDecision,
  type ExecSecurity,
} from "../infra/exec-approvals.js";
import { logWarn } from "../logger.js";
import { resolveExpiresAtMsFromDurationMs } from "../shared/number-coercion.js";
import { registerExecApprovalFollowupRuntimeHandoff } from "./bash-tools.exec-approval-followup-state.js";
import { sendExecApprovalFollowup } from "./bash-tools.exec-approval-followup.js";
import {
  type ExecApprovalRegistration,
  resolveRegisteredExecApprovalDecision,
} from "./bash-tools.exec-approval-request.js";
import { buildApprovalPendingMessage } from "./bash-tools.exec-runtime.js";
import { DEFAULT_APPROVAL_TIMEOUT_MS } from "./bash-tools.exec-runtime.js";
import type { ExecElevatedDefaults, ExecToolDetails } from "./bash-tools.exec-types.js";
import { isExecDeniedResultText } from "./exec-approval-result.js";
import type { AgentToolResult } from "./runtime/index.js";

type ResolvedExecApprovals = ReturnType<typeof resolveExecApprovals>;
/** Reused constant for MAX EXEC APPROVAL FOLLOWUP FAILURE LOG KEYS behavior in src/agents. */
export const MAX_EXEC_APPROVAL_FOLLOWUP_FAILURE_LOG_KEYS = 256;
const loggedExecApprovalFollowupFailures = new Set<string>();

function rememberExecApprovalFollowupFailureKey(key: string): boolean {
  if (loggedExecApprovalFollowupFailures.has(key)) {
    return false;
  }
  loggedExecApprovalFollowupFailures.add(key);
  // Bound memory growth for long-lived processes that see many unique approval failures.
  if (loggedExecApprovalFollowupFailures.size > MAX_EXEC_APPROVAL_FOLLOWUP_FAILURE_LOG_KEYS) {
    const oldestKey = loggedExecApprovalFollowupFailures.values().next().value;
    if (typeof oldestKey === "string") {
      loggedExecApprovalFollowupFailures.delete(oldestKey);
    }
  }
  return true;
}

/** Shared type for Exec Host Approval Context in src/agents. */
export type ExecHostApprovalContext = {
  approvals: ResolvedExecApprovals;
  hostSecurity: ExecSecurity;
  hostAsk: ExecAsk;
  askFallback: ResolvedExecApprovals["agent"]["askFallback"];
};

/** Shared type for Exec Approval Pending State in src/agents. */
export type ExecApprovalPendingState = {
  warningText: string;
  expiresAtMs: number;
  preResolvedDecision: string | null | undefined;
};

/** Shared type for Exec Approval Request State in src/agents. */
export type ExecApprovalRequestState = ExecApprovalPendingState & {
  noticeSeconds: number;
};

const EXPIRED_EXEC_APPROVAL_EXPIRES_AT_MS = 0;

/** Explains why no approval route can receive an exec request. */
export type ExecApprovalUnavailableReason =
  | "no-approval-route"
  | "initiating-platform-disabled"
  | "initiating-platform-unsupported";

function isHeadlessExecTrigger(trigger?: string): boolean {
  return trigger === "cron";
}

/** Shared type for Registered Exec Approval Request Context in src/agents. */
export type RegisteredExecApprovalRequestContext = {
  approvalId: string;
  approvalSlug: string;
  warningText: string;
  expiresAtMs: number;
  preResolvedDecision: string | null | undefined;
  initiatingSurface: ExecApprovalInitiatingSurfaceState;
  sentApproverDms: boolean;
  unavailableReason: ExecApprovalUnavailableReason | null;
};

/** Shared type for Exec Approval Followup Target in src/agents. */
export type ExecApprovalFollowupTarget = {
  approvalId: string;
  sessionKey?: string;
  turnSourceChannel?: string;
  turnSourceTo?: string;
  turnSourceAccountId?: string;
  turnSourceThreadId?: string | number;
  direct?: boolean;
  bashElevated?: ExecElevatedDefaults;
};

/** Shared type for Exec Approval Followup Result Deps in src/agents. */
export type ExecApprovalFollowupResultDeps = {
  sendExecApprovalFollowup?: typeof sendExecApprovalFollowup;
  logWarn?: typeof logWarn;
};

/** Shared type for Default Exec Approval Request Args in src/agents. */
export type DefaultExecApprovalRequestArgs = {
  warnings: string[];
  approvalRunningNoticeMs: number;
  createApprovalSlug: (approvalId: string) => string;
  turnSourceChannel?: string;
  turnSourceAccountId?: string;
};

/** Create pending approval state from warnings and timeout. */
export function createExecApprovalPendingState(params: {
  warnings: string[];
  timeoutMs: number;
}): ExecApprovalPendingState {
  const expiresAtMs =
    resolveExpiresAtMsFromDurationMs(params.timeoutMs) ?? EXPIRED_EXEC_APPROVAL_EXPIRES_AT_MS;
  return {
    warningText: params.warnings.length ? `${params.warnings.join("\n")}\n\n` : "",
    expiresAtMs,
    preResolvedDecision: undefined,
  };
}

/** Create approval request state including running notice timing. */
export function createExecApprovalRequestState(params: {
  warnings: string[];
  timeoutMs: number;
  approvalRunningNoticeMs: number;
}): ExecApprovalRequestState {
  const pendingState = createExecApprovalPendingState({
    warnings: params.warnings,
    timeoutMs: params.timeoutMs,
  });
  return {
    ...pendingState,
    noticeSeconds: Math.max(1, Math.round(params.approvalRunningNoticeMs / 1000)),
  };
}

/** Create a complete exec approval request context with generated id/slug. */
export function createExecApprovalRequestContext(params: {
  warnings: string[];
  timeoutMs: number;
  approvalRunningNoticeMs: number;
  createApprovalSlug: (approvalId: string) => string;
}): ExecApprovalRequestState & {
  approvalId: string;
  approvalSlug: string;
  contextKey: string;
} {
  const approvalId = crypto.randomUUID();
  const pendingState = createExecApprovalRequestState({
    warnings: params.warnings,
    timeoutMs: params.timeoutMs,
    approvalRunningNoticeMs: params.approvalRunningNoticeMs,
  });
  return {
    ...pendingState,
    approvalId,
    approvalSlug: params.createApprovalSlug(approvalId),
    contextKey: `exec:${approvalId}`,
  };
}

/** Reused helper for create Default Exec Approval Request Context behavior in src/agents. */
export function createDefaultExecApprovalRequestContext(params: {
  warnings: string[];
  approvalRunningNoticeMs: number;
  createApprovalSlug: (approvalId: string) => string;
}) {
  return createExecApprovalRequestContext({
    warnings: params.warnings,
    timeoutMs: DEFAULT_APPROVAL_TIMEOUT_MS,
    approvalRunningNoticeMs: params.approvalRunningNoticeMs,
    createApprovalSlug: params.createApprovalSlug,
  });
}

/** Reused helper for resolve Base Exec Approval Decision behavior in src/agents. */
export function resolveBaseExecApprovalDecision(params: {
  decision: string | null;
  askFallback: ResolvedExecApprovals["agent"]["askFallback"];
}): {
  approvedByAsk: boolean;
  deniedReason: string | null;
  timedOut: boolean;
} {
  if (params.decision === "deny") {
    return { approvedByAsk: false, deniedReason: "user-denied", timedOut: false };
  }
  if (!params.decision) {
    if (params.askFallback === "full") {
      return { approvedByAsk: true, deniedReason: null, timedOut: true };
    }
    if (params.askFallback === "deny") {
      return { approvedByAsk: false, deniedReason: "approval-timeout", timedOut: true };
    }
    return { approvedByAsk: false, deniedReason: null, timedOut: true };
  }
  return { approvedByAsk: false, deniedReason: null, timedOut: false };
}

/** Reused helper for resolve Exec Host Approval Context behavior in src/agents. */
export function resolveExecHostApprovalContext(params: {
  agentId?: string;
  security: ExecSecurity;
  ask: ExecAsk;
  host: "gateway" | "node";
}): ExecHostApprovalContext {
  const approvals = resolveExecApprovals(params.agentId, {
    security: params.security,
    ask: params.ask,
  });
  // Session/config tool policy is the caller's requested contract. The host file
  // may tighten that contract, but it must not silently broaden it.
  const hostSecurity = minSecurity(params.security, approvals.agent.security);
  const hostAsk = maxAsk(params.ask, approvals.agent.ask);
  const askFallback = minSecurity(hostSecurity, approvals.agent.askFallback);
  if (hostSecurity === "deny") {
    throw new Error(`exec denied: host=${params.host} security=deny`);
  }
  return { approvals, hostSecurity, hostAsk, askFallback };
}

/** Reused helper for resolve Approval Decision Or Undefined behavior in src/agents. */
export async function resolveApprovalDecisionOrUndefined(params: {
  approvalId: string;
  preResolvedDecision: string | null | undefined;
  onFailure: () => void;
}): Promise<string | null | undefined> {
  try {
    return await resolveRegisteredExecApprovalDecision({
      approvalId: params.approvalId,
      preResolvedDecision: params.preResolvedDecision,
    });
  } catch {
    params.onFailure();
    return undefined;
  }
}

/** Reused helper for resolve Exec Approval Unavailable State behavior in src/agents. */
export function resolveExecApprovalUnavailableState(params: {
  turnSourceChannel?: string;
  turnSourceAccountId?: string;
  preResolvedDecision: string | null | undefined;
}): {
  initiatingSurface: ExecApprovalInitiatingSurfaceState;
  sentApproverDms: boolean;
  unavailableReason: ExecApprovalUnavailableReason | null;
} {
  const initiatingSurface = resolveExecApprovalInitiatingSurfaceState({
    channel: params.turnSourceChannel,
    accountId: params.turnSourceAccountId,
  });
  // Native approval runtimes emit routed-elsewhere notices after actual delivery.
  // Avoid claiming approver DMs were sent from config-only guesses here.
  const sentApproverDms = false;
  const unavailableReason =
    params.preResolvedDecision === null
      ? "no-approval-route"
      : initiatingSurface.kind === "disabled"
        ? "initiating-platform-disabled"
        : initiatingSurface.kind === "unsupported"
          ? "initiating-platform-unsupported"
          : null;
  return {
    initiatingSurface,
    sentApproverDms,
    unavailableReason,
  };
}

/** Reused helper for create And Register Default Exec Approval Request behavior in src/agents. */
export async function createAndRegisterDefaultExecApprovalRequest(params: {
  warnings: string[];
  approvalRunningNoticeMs: number;
  createApprovalSlug: (approvalId: string) => string;
  turnSourceChannel?: string;
  turnSourceAccountId?: string;
  register: (approvalId: string) => Promise<ExecApprovalRegistration>;
}): Promise<RegisteredExecApprovalRequestContext> {
  const {
    approvalId,
    approvalSlug,
    warningText,
    expiresAtMs: defaultExpiresAtMs,
    preResolvedDecision: defaultPreResolvedDecision,
  } = createDefaultExecApprovalRequestContext({
    warnings: params.warnings,
    approvalRunningNoticeMs: params.approvalRunningNoticeMs,
    createApprovalSlug: params.createApprovalSlug,
  });
  const registration = await params.register(approvalId);
  const preResolvedDecision = registration.finalDecision;
  const { initiatingSurface, sentApproverDms, unavailableReason } =
    resolveExecApprovalUnavailableState({
      turnSourceChannel: params.turnSourceChannel,
      turnSourceAccountId: params.turnSourceAccountId,
      preResolvedDecision,
    });

  return {
    approvalId,
    approvalSlug,
    warningText,
    expiresAtMs: registration.expiresAtMs ?? defaultExpiresAtMs,
    preResolvedDecision:
      registration.finalDecision === undefined
        ? defaultPreResolvedDecision
        : registration.finalDecision,
    initiatingSurface,
    sentApproverDms,
    unavailableReason,
  };
}

/** Reused helper for build Default Exec Approval Request Args behavior in src/agents. */
export function buildDefaultExecApprovalRequestArgs(
  params: DefaultExecApprovalRequestArgs,
): DefaultExecApprovalRequestArgs {
  return {
    warnings: params.warnings,
    approvalRunningNoticeMs: params.approvalRunningNoticeMs,
    createApprovalSlug: params.createApprovalSlug,
    turnSourceChannel: params.turnSourceChannel,
    turnSourceAccountId: params.turnSourceAccountId,
  };
}

/** Reused helper for build Exec Approval Followup Target behavior in src/agents. */
export function buildExecApprovalFollowupTarget(
  params: ExecApprovalFollowupTarget,
): ExecApprovalFollowupTarget {
  return {
    approvalId: params.approvalId,
    sessionKey: params.sessionKey,
    turnSourceChannel: params.turnSourceChannel,
    turnSourceTo: params.turnSourceTo,
    turnSourceAccountId: params.turnSourceAccountId,
    turnSourceThreadId: params.turnSourceThreadId,
    direct: params.direct,
    bashElevated: params.bashElevated,
  };
}

/** Reused helper for create Exec Approval Decision State behavior in src/agents. */
export function createExecApprovalDecisionState(params: {
  decision: string | null | undefined;
  askFallback: ResolvedExecApprovals["agent"]["askFallback"];
}) {
  const baseDecision = resolveBaseExecApprovalDecision({
    decision: params.decision ?? null,
    askFallback: params.askFallback,
  });
  return {
    baseDecision,
    approvedByAsk: baseDecision.approvedByAsk,
    deniedReason: baseDecision.deniedReason,
  };
}

/** Reused helper for enforce Strict Inline Eval Approval Boundary behavior in src/agents. */
export function enforceStrictInlineEvalApprovalBoundary(params: {
  baseDecision: {
    timedOut: boolean;
  };
  approvedByAsk: boolean;
  deniedReason: string | null;
  requiresInlineEvalApproval: boolean;
  requiresAutoReviewHumanApproval?: boolean;
}): {
  approvedByAsk: boolean;
  deniedReason: string | null;
} {
  const requiresRealApproval =
    params.requiresInlineEvalApproval || params.requiresAutoReviewHumanApproval === true;
  if (!params.baseDecision.timedOut || !requiresRealApproval || !params.approvedByAsk) {
    return {
      approvedByAsk: params.approvedByAsk,
      deniedReason: params.deniedReason,
    };
  }
  return {
    approvedByAsk: false,
    deniedReason: params.deniedReason ?? "approval-timeout",
  };
}

/** Reused helper for should Resolve Exec Approval Unavailable Inline behavior in src/agents. */
export function shouldResolveExecApprovalUnavailableInline(params: {
  trigger?: string;
  unavailableReason: ExecApprovalUnavailableReason | null;
  preResolvedDecision: string | null | undefined;
}): boolean {
  return (
    isHeadlessExecTrigger(params.trigger) &&
    params.unavailableReason === "no-approval-route" &&
    params.preResolvedDecision === null
  );
}

/** Reused helper for build Headless Exec Approval Denied Message behavior in src/agents. */
export function buildHeadlessExecApprovalDeniedMessage(params: {
  trigger?: string;
  host: "gateway" | "node";
  security: ExecSecurity;
  ask: ExecAsk;
  askFallback: ResolvedExecApprovals["agent"]["askFallback"];
}): string {
  const runLabel = params.trigger === "cron" ? "Cron runs" : "Headless runs";
  return [
    `exec denied: ${runLabel} cannot wait for interactive exec approval.`,
    `Effective host exec policy: security=${params.security} ask=${params.ask} askFallback=${params.askFallback}`,
    "Stricter values from tools.exec and ~/.openclaw/exec-approvals.json both apply.",
    "Fix one of these:",
    '- align both files to security="full" and ask="off" for trusted local automation',
    "- keep allowlist mode and add an explicit allowlist entry for this command",
    "- enable Web UI, terminal UI, or chat exec approvals and rerun interactively",
    'Tip: run "openclaw doctor" and "openclaw approvals get --gateway" to inspect the effective policy.',
  ].join("\n");
}

/** Reused helper for send Exec Approval Followup Result behavior in src/agents. */
export async function sendExecApprovalFollowupResult(
  target: ExecApprovalFollowupTarget,
  resultText: string,
  deps: ExecApprovalFollowupResultDeps = {},
): Promise<void> {
  const send = deps.sendExecApprovalFollowup ?? sendExecApprovalFollowup;
  const warn = deps.logWarn ?? logWarn;
  const runtimeHandoff =
    target.direct === true || !target.sessionKey || isExecDeniedResultText(resultText)
      ? undefined
      : registerExecApprovalFollowupRuntimeHandoff({
          approvalId: target.approvalId,
          sessionKey: target.sessionKey,
          bashElevated: target.bashElevated,
        });
  await send({
    approvalId: target.approvalId,
    sessionKey: target.sessionKey,
    turnSourceChannel: target.turnSourceChannel,
    turnSourceTo: target.turnSourceTo,
    turnSourceAccountId: target.turnSourceAccountId,
    turnSourceThreadId: target.turnSourceThreadId,
    resultText,
    direct: target.direct,
    ...(runtimeHandoff
      ? {
          internalRuntimeHandoffId: runtimeHandoff.handoffId,
          idempotencyKey: runtimeHandoff.idempotencyKey,
        }
      : {}),
  }).catch((error) => {
    const message = formatErrorMessage(error);
    const key = `${target.approvalId}:${message}`;
    if (!rememberExecApprovalFollowupFailureKey(key)) {
      return;
    }
    warn(`exec approval followup dispatch failed (id=${target.approvalId}): ${message}`);
  });
}

/** Reused helper for build Exec Approval Pending Tool Result behavior in src/agents. */
export function buildExecApprovalPendingToolResult(params: {
  host: "gateway" | "node";
  command: string;
  cwd: string | undefined;
  warningText: string;
  approvalId: string;
  approvalSlug: string;
  expiresAtMs: number;
  initiatingSurface: ExecApprovalInitiatingSurfaceState;
  sentApproverDms: boolean;
  unavailableReason: ExecApprovalUnavailableReason | null;
  allowedDecisions?: readonly ExecApprovalDecision[];
  nodeId?: string;
}): AgentToolResult<ExecToolDetails> {
  const allowedDecisions = params.allowedDecisions ?? resolveExecApprovalAllowedDecisions();
  return {
    content: [
      {
        type: "text",
        text:
          params.unavailableReason !== null
            ? (buildExecApprovalUnavailableReplyPayload({
                warningText: params.warningText,
                reason: params.unavailableReason,
                channel: params.initiatingSurface.channel,
                channelLabel: params.initiatingSurface.channelLabel,
                accountId: params.initiatingSurface.accountId,
                sentApproverDms: params.sentApproverDms,
              }).text ?? "")
            : buildApprovalPendingMessage({
                warningText: params.warningText,
                approvalSlug: params.approvalSlug,
                approvalId: params.approvalId,
                allowedDecisions,
                command: params.command,
                cwd: params.cwd,
                host: params.host,
                nodeId: params.nodeId,
              }),
      },
    ],
    details:
      params.unavailableReason !== null
        ? ({
            status: "approval-unavailable",
            reason: params.unavailableReason,
            channel: params.initiatingSurface.channel,
            channelLabel: params.initiatingSurface.channelLabel,
            accountId: params.initiatingSurface.accountId,
            sentApproverDms: params.sentApproverDms,
            host: params.host,
            command: params.command,
            cwd: params.cwd,
            nodeId: params.nodeId,
            warningText: params.warningText,
          } satisfies ExecToolDetails)
        : ({
            status: "approval-pending",
            approvalId: params.approvalId,
            approvalSlug: params.approvalSlug,
            expiresAtMs: params.expiresAtMs,
            allowedDecisions,
            host: params.host,
            command: params.command,
            cwd: params.cwd,
            nodeId: params.nodeId,
            warningText: params.warningText,
          } satisfies ExecToolDetails),
  };
}
