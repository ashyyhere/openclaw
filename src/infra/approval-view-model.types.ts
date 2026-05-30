// Approval view-model contracts for native/channel presentation.
// Views normalize exec and plugin approvals into pending/resolved/expired display shapes.
import type { InteractiveReplyButton } from "../interactive/payload.js";
import type { ChannelApprovalKind } from "./approval-types.js";
import type { CommandExplanationSummary } from "./command-analysis/explain.js";
import type {
  ExecApprovalDecision,
  ExecApprovalRequest,
  ExecApprovalResolved,
} from "./exec-approvals.js";
import type { PluginApprovalRequest, PluginApprovalResolved } from "./plugin-approvals.js";

type ApprovalPhase = "pending" | "resolved" | "expired";

/** Display-ready approval action button/command. */
export type ApprovalActionView = {
  kind?: "command" | "decision";
  decision: ExecApprovalDecision;
  label: string;
  style: NonNullable<InteractiveReplyButton["style"]>;
  command: string;
};

/** Label/value metadata row shown with an approval view. */
export type ApprovalMetadataView = {
  label: string;
  value: string;
};

type ApprovalViewBase = {
  approvalId: string;
  approvalKind: ChannelApprovalKind;
  phase: ApprovalPhase;
  title: string;
  description?: string | null;
  metadata: ApprovalMetadataView[];
};

/** Shared display fields for all exec approval phases. */
export type ExecApprovalViewBase = ApprovalViewBase & {
  approvalKind: "exec";
  ask?: string | null;
  agentId?: string | null;
  warningText?: string | null;
  commandAnalysis?: CommandExplanationSummary | null;
  commandText: string;
  commandPreview?: string | null;
  cwd?: string | null;
  envKeys?: readonly string[];
  host?: string | null;
  nodeId?: string | null;
  sessionKey?: string | null;
};

/** Pending exec approval view with available actions and expiry. */
export type ExecApprovalPendingView = ExecApprovalViewBase & {
  phase: "pending";
  actions: ApprovalActionView[];
  expiresAtMs: number;
};

/** Resolved exec approval view with final decision and resolver. */
export type ExecApprovalResolvedView = ExecApprovalViewBase & {
  phase: "resolved";
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
};

/** Expired exec approval view after no decision was received. */
export type ExecApprovalExpiredView = ExecApprovalViewBase & {
  phase: "expired";
};

/** Shared display fields for all plugin approval phases. */
export type PluginApprovalViewBase = ApprovalViewBase & {
  approvalKind: "plugin";
  agentId?: string | null;
  pluginId?: string | null;
  toolName?: string | null;
  severity: "info" | "warning" | "critical";
};

/** Pending plugin approval view with available actions and expiry. */
export type PluginApprovalPendingView = PluginApprovalViewBase & {
  phase: "pending";
  actions: ApprovalActionView[];
  expiresAtMs: number;
};

/** Resolved plugin approval view with final decision and resolver. */
export type PluginApprovalResolvedView = PluginApprovalViewBase & {
  phase: "resolved";
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
};

/** Expired plugin approval view after no decision was received. */
export type PluginApprovalExpiredView = PluginApprovalViewBase & {
  phase: "expired";
};

/** Union of pending exec and plugin approval views. */
export type PendingApprovalView = ExecApprovalPendingView | PluginApprovalPendingView;
/** Union of resolved exec and plugin approval views. */
export type ResolvedApprovalView = ExecApprovalResolvedView | PluginApprovalResolvedView;
/** Union of expired exec and plugin approval views. */
export type ExpiredApprovalView = ExecApprovalExpiredView | PluginApprovalExpiredView;
/** Full approval view model union consumed by presentation runtimes. */
export type ApprovalViewModel = PendingApprovalView | ResolvedApprovalView | ExpiredApprovalView;

/** Approval request union represented by the view model layer. */
export type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
/** Approval resolution union represented by the view model layer. */
export type ApprovalResolved = ExecApprovalResolved | PluginApprovalResolved;
