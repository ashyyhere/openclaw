// Shared error graph/format helpers without the full infra-runtime surface.

/** Reused constant for SUBAGENT RUNTIME REQUEST SCOPE ERROR CODE behavior in src/plugin-sdk. */
export const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE = "OPENCLAW_SUBAGENT_RUNTIME_REQUEST_SCOPE";
/** Reused constant for SUBAGENT RUNTIME REQUEST SCOPE ERROR MESSAGE behavior in src/plugin-sdk. */
export const SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE =
  "Plugin runtime subagent methods are only available during a gateway request.";

/** Reused class for Request Scoped Subagent Runtime Error behavior in src/plugin-sdk. */
export class RequestScopedSubagentRuntimeError extends Error {
  code = SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_CODE;

  constructor(message = SUBAGENT_RUNTIME_REQUEST_SCOPE_ERROR_MESSAGE) {
    super(message);
    this.name = "RequestScopedSubagentRuntimeError";
  }
}

/** Re-exported API for src/plugin-sdk. */
export {
  collectErrorGraphCandidates,
  extractErrorCode,
  formatErrorMessage,
  formatUncaughtError,
  readErrorName,
} from "../infra/errors.js";
/** Re-exported API for src/plugin-sdk, starting with is Approval Not Found Error. */
export { isApprovalNotFoundError } from "../infra/approval-errors.ts";
