// Re-exports executable wrapper normalization, dispatch, and shell unwrapping helpers.
/** Executable token basename normalization helpers. */
export { basenameLower, normalizeExecutableToken } from "./exec-wrapper-tokens.js";
/** Dispatch-wrapper detection and unwrapping helpers. */
export {
  extractEnvAssignmentKeysFromDispatchWrappers,
  isDispatchWrapperExecutable,
  resolveDispatchWrapperTrustPlan,
  unwrapDispatchWrappersForResolution,
  unwrapEnvInvocation,
  unwrapKnownDispatchWrapperInvocation,
} from "./dispatch-wrapper-resolution.js";
/** Shell-wrapper detection, command extraction, and transport argv helpers. */
export {
  extractBindableShellWrapperInlineCommand,
  extractShellWrapperCommand,
  extractShellWrapperInlineCommand,
  hasEnvManipulationBeforeShellWrapper,
  isBlockedShellWrapperCommand,
  isShellWrapperExecutable,
  isShellWrapperInvocation,
  POSIX_SHELL_WRAPPERS,
  POWERSHELL_WRAPPERS,
  resolveShellWrapperTransportArgv,
  unwrapKnownShellMultiplexerInvocation,
} from "./shell-wrapper-resolution.js";
