// Plugin approval request/response contracts.
// Provides bounded approval payload shapes, timeout defaults, decision labels, and status text.
import type { ExecApprovalDecision } from "./exec-approvals.js";

/** Button/command descriptor shown with a plugin approval request. */
export type PluginApprovalActionView = {
  kind?: "command" | "decision";
  label: string;
  command: string;
  decision?: ExecApprovalDecision;
  style?: "primary" | "secondary" | "success" | "danger";
};

/** User-facing plugin approval payload and routing context. */
export type PluginApprovalRequestPayload = {
  pluginId?: string | null;
  title: string;
  description: string;
  severity?: "info" | "warning" | "critical" | null;
  toolName?: string | null;
  toolCallId?: string | null;
  allowedDecisions?: readonly ExecApprovalDecision[] | null;
  actions?: readonly PluginApprovalActionView[] | null;
  agentId?: string | null;
  sessionKey?: string | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
};

/** Pending plugin approval request with id and expiry metadata. */
export type PluginApprovalRequest = {
  id: string;
  request: PluginApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};

/** Resolved plugin approval decision and resolver metadata. */
export type PluginApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: PluginApprovalRequestPayload;
};

/** Default plugin approval expiry window. */
export const DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS = 120_000;
/** Maximum plugin approval expiry window accepted by callers. */
export const MAX_PLUGIN_APPROVAL_TIMEOUT_MS = 600_000;
/** Maximum normalized plugin approval title length. */
export const PLUGIN_APPROVAL_TITLE_MAX_LENGTH = 80;
/** Maximum normalized plugin approval description length. */
export const PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH = 256;
/** Default decision set offered for plugin approval requests. */
export const DEFAULT_PLUGIN_APPROVAL_DECISIONS = [
  "allow-once",
  "allow-always",
  "deny",
] as const satisfies readonly ExecApprovalDecision[];

/** Convert an approval decision into past-tense status text. */
export function approvalDecisionLabel(decision: ExecApprovalDecision): string {
  if (decision === "allow-once") {
    return "allowed once";
  }
  if (decision === "allow-always") {
    return "allowed always";
  }
  return "denied";
}

/** Normalize the allowed decision list for a plugin approval request. */
export function resolvePluginApprovalRequestAllowedDecisions(params?: {
  allowedDecisions?: readonly ExecApprovalDecision[] | readonly string[] | null;
}): readonly ExecApprovalDecision[] {
  const explicit: ExecApprovalDecision[] = [];
  if (Array.isArray(params?.allowedDecisions)) {
    for (const decision of params.allowedDecisions) {
      if (
        (decision === "allow-once" || decision === "allow-always" || decision === "deny") &&
        !explicit.includes(decision)
      ) {
        explicit.push(decision);
      }
    }
  }
  return explicit.length > 0 ? explicit : DEFAULT_PLUGIN_APPROVAL_DECISIONS;
}

/** Build the text body for a pending plugin approval request. */
export function buildPluginApprovalRequestMessage(
  request: PluginApprovalRequest,
  nowMsValue: number,
): string {
  const lines: string[] = [];
  const severity = request.request.severity ?? "warning";
  const icon = severity === "critical" ? "🚨" : severity === "info" ? "ℹ️" : "🛡️";
  lines.push(`${icon} Plugin approval required`);
  lines.push(`Title: ${request.request.title}`);
  lines.push(`Description: ${request.request.description}`);
  if (request.request.toolName) {
    lines.push(`Tool: ${request.request.toolName}`);
  }
  if (request.request.pluginId) {
    lines.push(`Plugin: ${request.request.pluginId}`);
  }
  if (request.request.agentId) {
    lines.push(`Agent: ${request.request.agentId}`);
  }
  lines.push(`ID: ${request.id}`);
  const expiresIn = Math.max(0, Math.round((request.expiresAtMs - nowMsValue) / 1000));
  lines.push(`Expires in: ${expiresIn}s`);
  lines.push(
    `Reply with: /approve <id> ${resolvePluginApprovalRequestAllowedDecisions(request.request).join(
      "|",
    )}`,
  );
  return lines.join("\n");
}

/** Build the text body for a resolved plugin approval notification. */
export function buildPluginApprovalResolvedMessage(resolved: PluginApprovalResolved): string {
  const base = `✅ Plugin approval ${approvalDecisionLabel(resolved.decision)}.`;
  const by = resolved.resolvedBy ? ` Resolved by ${resolved.resolvedBy}.` : "";
  return `${base}${by} ID: ${resolved.id}`;
}

/** Build the text body for an expired plugin approval notification. */
export function buildPluginApprovalExpiredMessage(request: PluginApprovalRequest): string {
  return `⏱️ Plugin approval expired. ID: ${request.id}`;
}
