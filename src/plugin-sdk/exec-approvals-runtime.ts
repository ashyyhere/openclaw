// Exec approval policy file helpers without the broad infra-runtime barrel.

/** Re-exported API for src/plugin-sdk. */
export {
  loadExecApprovals,
  resolveExecApprovalsFromFile,
  type ExecApprovalsFile,
} from "../infra/exec-approvals.js";
