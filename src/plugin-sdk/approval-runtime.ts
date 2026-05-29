// Approval request/reply helpers for exec and plugin approval flows.

/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk. */
export {
  buildExecApprovalPendingReplyPayload,
  getExecApprovalApproverDmNoticeText,
  getExecApprovalReplyMetadata,
  type ExecApprovalPendingReplyParams,
  type ExecApprovalReplyDecision,
  type ExecApprovalReplyMetadata,
} from "../infra/exec-approval-reply.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Exec Approval Command Display. */
export { resolveExecApprovalCommandDisplay } from "../infra/exec-approval-command-display.js";
/** Re-exported API for src/plugin-sdk, starting with format Approval Display Path. */
export { formatApprovalDisplayPath } from "../infra/approval-display-paths.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createChannelApproverDmTargetResolver,
  createChannelNativeOriginTargetResolver,
} from "./approval-native-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveApprovalRequestOriginTarget,
  resolveApprovalRequestSessionTarget,
  resolveExecApprovalSessionTarget,
  type ExecApprovalSessionTarget,
} from "../infra/exec-approval-session-target.js";
/** Re-exported API for src/plugin-sdk. */
export {
  doesApprovalRequestMatchChannelAccount,
  resolveApprovalRequestAccountId,
  resolveApprovalRequestChannelAccountId,
} from "../infra/approval-request-account-binding.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk, starting with create Resolved Approver Action Auth Adapter. */
export { createResolvedApproverActionAuthAdapter } from "./approval-auth-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createChannelExecApprovalProfile,
  isChannelExecApprovalClientEnabledFromConfig,
  isChannelExecApprovalTargetRecipient,
} from "./approval-client-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with create Channel Native Approval Runtime. */
export { createChannelNativeApprovalRuntime } from "../infra/approval-native-runtime.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createApproverRestrictedNativeApprovalAdapter,
  createApproverRestrictedNativeApprovalCapability,
  createChannelApprovalCapability,
  splitChannelApprovalCapability,
} from "./approval-delivery-helpers.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Approval Approvers. */
export { resolveApprovalApprovers } from "./approval-approvers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  matchesApprovalRequestFilters,
  matchesApprovalRequestSessionFilter,
  type ApprovalRequestFilterInput,
} from "../infra/approval-request-filters.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildApprovalPendingReplyPayload,
  buildApprovalResolvedReplyPayload,
  buildPluginApprovalPendingReplyPayload,
  buildPluginApprovalResolvedReplyPayload,
} from "./approval-renderers.js";
