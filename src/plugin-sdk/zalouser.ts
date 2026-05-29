/**
 * @deprecated Compatibility facade for published Lark/Zalo packages that imported
 * command authorization through `openclaw/plugin-sdk/zalouser`.
 */
export {
  resolveSenderCommandAuthorization,
  resolveSenderCommandAuthorizationWithRuntime,
} from "./command-auth.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  CommandAuthorizationRuntime,
  ResolveSenderCommandAuthorizationParams,
  ResolveSenderCommandAuthorizationWithRuntimeParams,
} from "./command-auth.js";
