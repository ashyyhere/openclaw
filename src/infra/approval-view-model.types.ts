// Shared types for infra approval view model types behavior.
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

/** Shared type for Approval Action View in src/infra. */
export type ApprovalActionView = {
  kind?: "command" | "decision";
  decision: ExecApprovalDecision;
  label: string;
  style: NonNullable<InteractiveReplyButton["style"]>;
  command: string;
};

/** Shared type for Approval Metadata View in src/infra. */
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

/** Shared type for Exec Approval View Base in src/infra. */
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

/** Shared type for Exec Approval Pending View in src/infra. */
export type ExecApprovalPendingView = ExecApprovalViewBase & {
  phase: "pending";
  actions: ApprovalActionView[];
  expiresAtMs: number;
};

/** Shared type for Exec Approval Resolved View in src/infra. */
export type ExecApprovalResolvedView = ExecApprovalViewBase & {
  phase: "resolved";
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
};

/** Shared type for Exec Approval Expired View in src/infra. */
export type ExecApprovalExpiredView = ExecApprovalViewBase & {
  phase: "expired";
};

/** Shared type for Plugin Approval View Base in src/infra. */
export type PluginApprovalViewBase = ApprovalViewBase & {
  approvalKind: "plugin";
  agentId?: string | null;
  pluginId?: string | null;
  toolName?: string | null;
  severity: "info" | "warning" | "critical";
};

/** Shared type for Plugin Approval Pending View in src/infra. */
export type PluginApprovalPendingView = PluginApprovalViewBase & {
  phase: "pending";
  actions: ApprovalActionView[];
  expiresAtMs: number;
};

/** Shared type for Plugin Approval Resolved View in src/infra. */
export type PluginApprovalResolvedView = PluginApprovalViewBase & {
  phase: "resolved";
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
};

/** Shared type for Plugin Approval Expired View in src/infra. */
export type PluginApprovalExpiredView = PluginApprovalViewBase & {
  phase: "expired";
};

/** Shared type for Pending Approval View in src/infra. */
export type PendingApprovalView = ExecApprovalPendingView | PluginApprovalPendingView;
/** Shared type for Resolved Approval View in src/infra. */
export type ResolvedApprovalView = ExecApprovalResolvedView | PluginApprovalResolvedView;
/** Shared type for Expired Approval View in src/infra. */
export type ExpiredApprovalView = ExecApprovalExpiredView | PluginApprovalExpiredView;
/** Shared type for Approval View Model in src/infra. */
export type ApprovalViewModel = PendingApprovalView | ResolvedApprovalView | ExpiredApprovalView;

/** Shared type for Approval Request in src/infra. */
export type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
/** Shared type for Approval Resolved in src/infra. */
export type ApprovalResolved = ExecApprovalResolved | PluginApprovalResolved;
