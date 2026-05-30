// Focused public test contracts for native agent-runtime adapters.

/** Auth-profile runtime contract helpers shared by native adapter tests. */
export {
  AUTH_PROFILE_RUNTIME_CONTRACT,
  createAuthAliasManifestRegistry,
  expectedForwardedAuthProfile,
} from "./test-helpers/agents/auth-profile-runtime-contract.js";
/** Contract fixture for delivery paths that intentionally suppress replies. */
export { DELIVERY_NO_REPLY_RUNTIME_CONTRACT } from "./test-helpers/agents/delivery-no-reply-runtime-contract.js";
/** Tool-result middleware contract helpers for OpenClaw-owned tools. */
export {
  installCodexToolResultMiddleware,
  installOpenClawOwnedToolHooks,
  mediaToolResult,
  resetOpenClawOwnedToolHooks,
  textToolResult,
} from "./test-helpers/agents/openclaw-owned-tool-runtime-contract.js";
/** Outcome fallback fixtures for adapter runtime tests. */
export {
  createContractFallbackConfig,
  createContractRunResult,
  OUTCOME_FALLBACK_RUNTIME_CONTRACT,
} from "./test-helpers/agents/outcome-fallback-runtime-contract.js";
/** Prompt overlay fixtures and provider/model ids for native runtime tests. */
export {
  CODEX_CONTRACT_PROVIDER_ID,
  codexPromptOverlayContext,
  GPT5_CONTRACT_MODEL_ID,
  GPT5_PREFIXED_CONTRACT_MODEL_ID,
  NON_GPT5_CONTRACT_MODEL_ID,
  NON_OPENAI_CONTRACT_PROVIDER_ID,
  OPENAI_CODEX_CONTRACT_PROVIDER_ID,
  OPENAI_CONTRACT_PROVIDER_ID,
  openAiPluginPersonalityConfig,
  sharedGpt5PersonalityConfig,
} from "./test-helpers/agents/prompt-overlay-runtime-contract.js";
/** Schema normalization fixtures for OpenAI-compatible native runtimes. */
export {
  createNativeOpenAICodexResponsesModel,
  createNativeOpenAIResponsesModel,
  createParameterFreeTool,
  createPermissiveTool,
  createProxyOpenAIResponsesModel,
  createStrictCompatibleTool,
  normalizedParameterFreeSchema,
} from "./test-helpers/agents/schema-normalization-runtime-contract.js";
/** Transcript repair fixtures covering structured and media-only history entries. */
export {
  assistantHistoryMessage,
  currentPromptHistoryMessage,
  inlineDataUriOrphanLeaf,
  mediaOnlyHistoryMessage,
  QUEUED_USER_MESSAGE_MARKER,
  structuredHistoryMessage,
  structuredOrphanLeaf,
  textOrphanLeaf,
} from "./test-helpers/agents/transcript-repair-runtime-contract.js";
