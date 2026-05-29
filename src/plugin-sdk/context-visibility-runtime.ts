// Narrow context visibility helpers without broad config-runtime imports.

/** Re-exported API for src/plugin-sdk. */
export {
  resolveChannelContextVisibilityMode,
  resolveDefaultContextVisibility,
} from "../config/context-visibility.js";
/** Re-exported API for src/plugin-sdk. */
export {
  evaluateSupplementalContextVisibility,
  filterSupplementalContextItems,
  shouldIncludeSupplementalContext,
  type ContextVisibilityDecision,
  type ContextVisibilityDecisionReason,
  type ContextVisibilityKind,
} from "../security/context-visibility.js";
