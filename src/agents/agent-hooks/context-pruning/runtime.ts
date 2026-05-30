/** Runtime registry for context-pruning extension dependencies. */
import { createSessionManagerRuntimeRegistry } from "../session-manager-runtime-registry.js";
import type { EffectiveContextPruningSettings } from "./settings.js";

/** Runtime values supplied by the session manager to context pruning hooks. */
export type ContextPruningRuntimeValue = {
  settings: EffectiveContextPruningSettings;
  contextWindowTokens?: number | null;
  isToolPrunable: (toolName: string) => boolean;
  dropThinkingBlocks: boolean;
  lastCacheTouchAt?: number | null;
};

// Important: this relies on the embedded agent runtime passing the same SessionManager instance into
// ExtensionContext (ctx.sessionManager) that we used when calling setContextPruningRuntime.
const registry = createSessionManagerRuntimeRegistry<ContextPruningRuntimeValue>();

/** Register context-pruning runtime values for a session manager instance. */
export const setContextPruningRuntime = registry.set;

/** Read context-pruning runtime values for the current session manager. */
export const getContextPruningRuntime = registry.get;
