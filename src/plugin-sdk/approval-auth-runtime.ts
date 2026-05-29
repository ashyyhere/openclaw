/** Runtime SDK barrel for approval authorization helpers. */
export { resolveApprovalApprovers } from "./approval-approvers.js";
/** Re-exported API for src/plugin-sdk. */
export {
  createResolvedApproverActionAuthAdapter,
  isImplicitSameChatApprovalAuthorization,
  markImplicitSameChatApprovalAuthorization,
} from "./approval-auth-helpers.js";
