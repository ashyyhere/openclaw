// Lazy runtime boundary for forwarding exec approval messages.
/** Resolves the outbound session target for an exec approval request. */
export { resolveExecApprovalSessionTarget } from "./exec-approval-session-target.js";
/** Durable message sender used after the forwarding runtime loads. */
export { sendDurableMessageBatch } from "../channels/message/runtime.js";
