// gateway server aux methods helpers and runtime behavior.
/** Reused constant for GATEWAY AUX METHODS behavior in src/gateway. */
export const GATEWAY_AUX_METHODS = [
  "exec.approval.get",
  "exec.approval.list",
  "exec.approval.request",
  "exec.approval.waitDecision",
  "exec.approval.resolve",
  "plugin.approval.list",
  "plugin.approval.request",
  "plugin.approval.waitDecision",
  "plugin.approval.resolve",
  "secrets.reload",
  "secrets.resolve",
] as const;
