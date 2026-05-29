/**
 * Opt-in context pruning (“microcompact”-style) for agent sessions.
 *
 * This only affects the in-memory context for the current request; it does not rewrite session
 * history persisted on disk.
 */

export { default } from "./context-pruning/extension.js";

/** Re-exported API for src/agents/agent-hooks, starting with prune Context Messages. */
export { pruneContextMessages } from "./context-pruning/pruner.js";
/** Re-exported API for src/agents/agent-hooks. */
export {
  computeEffectiveSettings,
  DEFAULT_CONTEXT_PRUNING_SETTINGS,
} from "./context-pruning/settings.js";
