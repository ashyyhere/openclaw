// hooks hooks helpers and runtime behavior.
/** Shared type for Hook Handler in src/hooks. */
export type HookHandler = import("./internal-hook-types.js").InternalHookHandler;

/** Re-exported API for src/hooks, starting with Agent Bootstrap Hook Context. */
export type { AgentBootstrapHookContext } from "./internal-hooks.js";
/** Re-exported API for src/hooks. */
export {
  createInternalHookEvent as createHookEvent,
  isAgentBootstrapEvent,
} from "./internal-hooks.js";
