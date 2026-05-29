// extensions/anthropic api helpers and runtime behavior.
/** Re-exported anthropic plugin public API, starting with CLAUDE CLI BACKEND ID. */
export { CLAUDE_CLI_BACKEND_ID, isClaudeCliProvider } from "./cli-shared.js";
/** Re-exported anthropic plugin public API, starting with build Anthropic Provider. */
export { buildAnthropicProvider } from "./register.runtime.js";
/** Re-exported anthropic plugin public API. */
export {
  createAnthropicBetaHeadersWrapper,
  createAnthropicFastModeWrapper,
  createAnthropicServiceTierWrapper,
  resolveAnthropicBetas,
  resolveAnthropicFastMode,
  resolveAnthropicServiceTier,
  wrapAnthropicProviderStream,
} from "./stream-wrappers.js";
