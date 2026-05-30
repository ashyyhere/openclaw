// Node-side command method names used by gateway/tool dispatch.
// Keep these constants aligned with registered node handlers.
/** System command methods that prepare/run commands or resolve executables. */
export const NODE_SYSTEM_RUN_COMMANDS = [
  "system.run.prepare",
  "system.run",
  "system.which",
] as const;

/** Fire-and-forget notification method handled by node runtime surfaces. */
export const NODE_SYSTEM_NOTIFY_COMMAND = "system.notify";
/** Browser proxy method routed through the node runtime. */
export const NODE_BROWSER_PROXY_COMMAND = "browser.proxy";

/** Exec approval methods exposed to node command dispatch. */
export const NODE_EXEC_APPROVALS_COMMANDS = [
  "system.execApprovals.get",
  "system.execApprovals.set",
] as const;
