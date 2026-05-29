// Runtime boundary for tasks task registry control runtime behavior.
/** Re-export ACP session manager lookup for task cancellation/control paths. */
export { getAcpSessionManager } from "../acp/control-plane/manager.js";
/** Re-export privileged subagent kill helper for task cancellation/control paths. */
export { killSubagentRunAdmin } from "../agents/subagent-control.js";
