// Public hook facade for internal hook handlers and hook event helpers.
/** Internal hook handler function type. */
export type HookHandler = import("./internal-hook-types.js").InternalHookHandler;

/** Re-export bootstrap hook context for hook consumers. */
export type { AgentBootstrapHookContext } from "./internal-hooks.js";
/** Re-export hook event construction and bootstrap type guard. */
export {
  createInternalHookEvent as createHookEvent,
  isAgentBootstrapEvent,
} from "./internal-hooks.js";
