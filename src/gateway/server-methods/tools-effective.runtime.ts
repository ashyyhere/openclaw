// Runtime boundary for gateway/server-methods tools effective runtime behavior.
/** Agent scope helpers needed to resolve effective tool inventory per session. */
export {
  listAgentIds,
  resolveAgentDir,
  resolveAgentWorkspaceDir,
  resolveSessionAgentId,
} from "../../agents/agent-scope.js";
/** Effective tool inventory resolver and runtime model context builder. */
export {
  resolveEffectiveToolInventory,
  resolveEffectiveToolInventoryRuntimeModelContext,
} from "../../agents/tools-effective-inventory.js";
/** Bundle MCP tool catalog and per-session runtime summary helpers. */
export {
  buildBundleMcpToolsFromCatalog,
  peekSessionMcpRuntime,
  resolveSessionMcpConfigSummary,
} from "../../agents/agent-bundle-mcp-tools.js";
/** Apply final policy filters before effective tools are returned to clients. */
export { applyFinalEffectiveToolPolicy } from "../../agents/embedded-agent-runner/effective-tool-policy.js";
/** Resolve auto-reply thread targeting for effective tool context. */
export { resolveReplyToMode } from "../../auto-reply/reply/reply-threading.js";
/** Build runtime config cache keys for effective tool invalidation. */
export { resolveRuntimeConfigCacheKey } from "../../config/config.js";
/** Plugin registry version counters that invalidate cached effective tools. */
export {
  getActivePluginChannelRegistryVersion,
  getActivePluginRegistryVersion,
} from "../../plugins/runtime.js";
/** Convert session metadata into delivery context for effective tool decisions. */
export { deliveryContextFromSession } from "../../utils/delivery-context.shared.js";
/** Session loading helpers used while resolving per-session tool availability. */
export { loadSessionEntry, resolveSessionModelRef } from "../session-utils.js";
