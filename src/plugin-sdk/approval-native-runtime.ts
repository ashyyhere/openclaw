/** Runtime SDK barrel for native approval route, session, and target helpers. */
export {
  createChannelApprovalForwardingEvaluator,
  createChannelApproverDmTargetResolver,
  createChannelNativeOriginTargetResolver,
  createNativeApprovalChannelRouteGates,
  createNativeApprovalForwardingFallbackSuppressor,
  nativeApprovalTargetsMatch,
  resolveApprovalKind,
  shouldSuppressLocalNativeExecApprovalPrompt,
  type ChannelApprovalExplicitTargetEligibilityParams,
  type ChannelApprovalForwardingEligibilityParams,
  type ChannelApprovalPotentialRouteParams,
} from "./approval-native-helpers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  resolveApprovalRequestSessionConversation,
  resolveApprovalRequestOriginTarget,
  resolveApprovalRequestSessionTarget,
  resolveExecApprovalSessionTarget,
  type ApprovalRequestSessionConversation,
  type ExecApprovalSessionTarget,
} from "../infra/exec-approval-session-target.js";
/** Re-exported API for src/plugin-sdk, starting with build Channel Approval Native Target Key. */
export { buildChannelApprovalNativeTargetKey } from "../infra/approval-native-target-key.js";
/** Re-exported API for src/plugin-sdk. */
export {
  doesApprovalRequestMatchChannelAccount,
  resolveApprovalRequestAccountId,
  resolveApprovalRequestChannelAccountId,
} from "../infra/approval-request-account-binding.js";
