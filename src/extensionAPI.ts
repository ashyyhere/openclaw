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

/** Re-exported API for src, starting with resolve Agent Dir. */
export { resolveAgentDir, resolveAgentWorkspaceDir } from "./agents/agent-scope.js";
/** Re-exported API for src, starting with DEFAULT MODEL. */
export { DEFAULT_MODEL, DEFAULT_PROVIDER } from "./agents/defaults.js";
/** Re-exported API for src, starting with resolve Agent Identity. */
export { resolveAgentIdentity } from "./agents/identity.js";
/** Re-exported API for src, starting with resolve Thinking Default. */
export { resolveThinkingDefault } from "./agents/model-selection.js";
/** Re-exported API for src. */
export {
  runEmbeddedAgent,
  /** @deprecated Use runEmbeddedAgent. */
  runEmbeddedAgent as runEmbeddedPiAgent,
} from "./agents/embedded-agent.js";
/** Re-exported API for src, starting with resolve Agent Timeout Ms. */
export { resolveAgentTimeoutMs } from "./agents/timeout.js";
/** Re-exported API for src, starting with ensure Agent Workspace. */
export { ensureAgentWorkspace } from "./agents/workspace.js";
/** Re-exported API for src. */
export {
  resolveStorePath,
  loadSessionStore,
  saveSessionStore,
  updateSessionStore,
  updateSessionStoreEntry,
  resolveSessionFilePath,
} from "./config/sessions.js";
