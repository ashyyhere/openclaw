// Approval request/reply helpers for exec and plugin approval flows.

/** Exec approval request, decision, timeout, and host contracts. */
export {
  DEFAULT_EXEC_APPROVAL_TIMEOUT_MS,
  resolveExecApprovalAllowedDecisions,
  resolveExecApprovalRequestAllowedDecisions,
  type ExecApprovalDecision,
  type ExecApprovalRequest,
  type ExecApprovalRequestPayload,
  type ExecApprovalResolved,
  type ExecHost,
} from "../infra/exec-approvals.js";
/** Exec approval reply payload and approver DM metadata helpers. */
export {
  buildExecApprovalPendingReplyPayload,
  getExecApprovalApproverDmNoticeText,
  getExecApprovalReplyMetadata,
  type ExecApprovalPendingReplyParams,
  type ExecApprovalReplyDecision,
  type ExecApprovalReplyMetadata,
} from "../infra/exec-approval-reply.js";
/** Formats exec approval commands for human review surfaces. */
export { resolveExecApprovalCommandDisplay } from "../infra/exec-approval-command-display.js";
/** Formats filesystem paths shown inside approval prompts. */
export { formatApprovalDisplayPath } from "../infra/approval-display-paths.js";
/** Channel-native target resolvers for approver DMs and origin replies. */
export {
  createChannelApproverDmTargetResolver,
  createChannelNativeOriginTargetResolver,
} from "./approval-native-helpers.js";
/** Session and origin target resolution helpers for approval requests. */
export {
  resolveApprovalRequestOriginTarget,
  resolveApprovalRequestSessionTarget,
  resolveExecApprovalSessionTarget,
  type ExecApprovalSessionTarget,
} from "../infra/exec-approval-session-target.js";
/** Account-binding helpers that keep approvals scoped to the right channel account. */
export {
  doesApprovalRequestMatchChannelAccount,
  resolveApprovalRequestAccountId,
  resolveApprovalRequestChannelAccountId,
} from "../infra/approval-request-account-binding.js";
/** Plugin approval request, timeout, message, and resolution contracts. */
export {
  buildPluginApprovalExpiredMessage,
  buildPluginApprovalRequestMessage,
  buildPluginApprovalResolvedMessage,
  DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS,
  MAX_PLUGIN_APPROVAL_TIMEOUT_MS,
  type PluginApprovalRequest,
  type PluginApprovalRequestPayload,
  type PluginApprovalResolved,
} from "../infra/plugin-approvals.js";
/** Creates an auth adapter for already-resolved approver actions. */
export { createResolvedApproverActionAuthAdapter } from "./approval-auth-helpers.js";
/** Channel exec-approval profile and recipient helpers. */
export {
  createChannelExecApprovalProfile,
  isChannelExecApprovalClientEnabledFromConfig,
  isChannelExecApprovalTargetRecipient,
} from "./approval-client-helpers.js";
/** Creates a channel-native approval runtime for plugin delivery surfaces. */
export { createChannelNativeApprovalRuntime } from "../infra/approval-native-runtime.js";
/** Delivery helpers for channel approval capabilities and approver restrictions. */
export {
  createApproverRestrictedNativeApprovalAdapter,
  createApproverRestrictedNativeApprovalCapability,
  createChannelApprovalCapability,
  splitChannelApprovalCapability,
} from "./approval-delivery-helpers.js";
/** Resolves configured approvers for approval delivery. */
export { resolveApprovalApprovers } from "./approval-approvers.js";
/** Filter helpers for matching approval requests to sessions and inputs. */
export {
  matchesApprovalRequestFilters,
  matchesApprovalRequestSessionFilter,
  type ApprovalRequestFilterInput,
} from "../infra/approval-request-filters.js";
/** Renderer helpers for pending and resolved approval reply payloads. */
export {
  buildApprovalPendingReplyPayload,
  buildApprovalResolvedReplyPayload,
  buildPluginApprovalPendingReplyPayload,
  buildPluginApprovalResolvedReplyPayload,
} from "./approval-renderers.js";
