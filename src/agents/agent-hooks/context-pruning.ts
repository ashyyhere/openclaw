/**
 * Opt-in context pruning (“microcompact”-style) for agent sessions.
 *
 * This only affects the in-memory context for the current request; it does not rewrite session
 * history persisted on disk.
 */

export { default } from "./context-pruning/extension.js";

/** Context pruner used by hooks and direct harness callers. */
export { pruneContextMessages } from "./context-pruning/pruner.js";
/** Context pruning settings helpers shared with config and runtime code. */
export {
  computeEffectiveSettings,
  DEFAULT_CONTEXT_PRUNING_SETTINGS,
} from "./context-pruning/settings.js";
