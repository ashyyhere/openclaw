// infra node commands helpers and runtime behavior.
/** Reused constant for NODE SYSTEM RUN COMMANDS behavior in src/infra. */
export const NODE_SYSTEM_RUN_COMMANDS = [
  "system.run.prepare",
  "system.run",
  "system.which",
] as const;

/** Reused constant for NODE SYSTEM NOTIFY COMMAND behavior in src/infra. */
export const NODE_SYSTEM_NOTIFY_COMMAND = "system.notify";
/** Reused constant for NODE BROWSER PROXY COMMAND behavior in src/infra. */
export const NODE_BROWSER_PROXY_COMMAND = "browser.proxy";

/** Reused constant for NODE EXEC APPROVALS COMMANDS behavior in src/infra. */
export const NODE_EXEC_APPROVALS_COMMANDS = [
  "system.execApprovals.get",
  "system.execApprovals.set",
] as const;
