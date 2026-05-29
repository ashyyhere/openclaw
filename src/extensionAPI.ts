/**
 * @deprecated Legacy compat surface for plugins that still import
 * openclaw/extension-api. Use the injected plugin runtime or focused
 * openclaw/plugin-sdk subpaths instead.
 */

const shouldWarnExtensionApiImport =
  process.env.VITEST !== "true" &&
  process.env.NODE_ENV !== "test" &&
  process.env.OPENCLAW_SUPPRESS_EXTENSION_API_WARNING !== "1";

if (shouldWarnExtensionApiImport) {
  process.emitWarning(
    "openclaw/extension-api is deprecated. Migrate to api.runtime.agent.* or focused openclaw/plugin-sdk/<subpath> imports. See https://docs.openclaw.ai/plugins/sdk-migration",
    {
      code: "OPENCLAW_EXTENSION_API_DEPRECATED",
      detail:
        "This compatibility bridge is temporary. Bundled plugins should use the injected plugin runtime instead of importing host-side agent helpers directly. Migration guide: https://docs.openclaw.ai/plugins/sdk-migration",
    },
  );
}

/** Legacy agent path helpers kept for deprecated extension-api importers. */
export { resolveAgentDir, resolveAgentWorkspaceDir } from "./agents/agent-scope.js";
/** Legacy default model/provider constants kept for deprecated extension-api importers. */
export { DEFAULT_MODEL, DEFAULT_PROVIDER } from "./agents/defaults.js";
/** Legacy agent identity resolver kept for deprecated extension-api importers. */
export { resolveAgentIdentity } from "./agents/identity.js";
/** Legacy thinking-default resolver kept for deprecated extension-api importers. */
export { resolveThinkingDefault } from "./agents/model-selection.js";
/** Legacy embedded agent runner export kept for deprecated extension-api importers. */
export {
  runEmbeddedAgent,
  /** @deprecated Use runEmbeddedAgent. */
  runEmbeddedAgent as runEmbeddedPiAgent,
} from "./agents/embedded-agent.js";
/** Legacy agent timeout resolver kept for deprecated extension-api importers. */
export { resolveAgentTimeoutMs } from "./agents/timeout.js";
/** Legacy workspace setup helper kept for deprecated extension-api importers. */
export { ensureAgentWorkspace } from "./agents/workspace.js";
/** Legacy session-store helpers kept for deprecated extension-api importers. */
export {
  resolveStorePath,
  loadSessionStore,
  saveSessionStore,
  updateSessionStore,
  updateSessionStoreEntry,
  resolveSessionFilePath,
} from "./config/sessions.js";
