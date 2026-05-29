// Runtime boundary for gateway/server-methods tools effective runtime behavior.
/** Re-exported API for src/gateway/server-methods. */
export {
  listAgentIds,
  resolveAgentDir,
  resolveAgentWorkspaceDir,
  resolveSessionAgentId,
} from "../../agents/agent-scope.js";
/** Re-exported API for src/gateway/server-methods. */
export {
  resolveEffectiveToolInventory,
  resolveEffectiveToolInventoryRuntimeModelContext,
} from "../../agents/tools-effective-inventory.js";
/** Re-exported API for src/gateway/server-methods. */
export {
  buildBundleMcpToolsFromCatalog,
  peekSessionMcpRuntime,
  resolveSessionMcpConfigSummary,
} from "../../agents/agent-bundle-mcp-tools.js";
/** Re-exported API for src/gateway/server-methods, starting with apply Final Effective Tool Policy. */
export { applyFinalEffectiveToolPolicy } from "../../agents/embedded-agent-runner/effective-tool-policy.js";
/** Re-exported API for src/gateway/server-methods, starting with resolve Reply To Mode. */
export { resolveReplyToMode } from "../../auto-reply/reply/reply-threading.js";
/** Re-exported API for src/gateway/server-methods, starting with resolve Runtime Config Cache Key. */
export { resolveRuntimeConfigCacheKey } from "../../config/config.js";
/** Re-exported API for src/gateway/server-methods. */
export {
  getActivePluginChannelRegistryVersion,
  getActivePluginRegistryVersion,
} from "../../plugins/runtime.js";
/** Re-exported API for src/gateway/server-methods, starting with delivery Context From Session. */
export { deliveryContextFromSession } from "../../utils/delivery-context.shared.js";
/** Re-exported API for src/gateway/server-methods, starting with load Session Entry. */
export { loadSessionEntry, resolveSessionModelRef } from "../session-utils.js";
