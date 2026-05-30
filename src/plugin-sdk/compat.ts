/**
 * @deprecated Legacy compat surface for external plugins that still depend on
 * older broad plugin-sdk imports. Use focused openclaw/plugin-sdk subpaths
 * instead.
 */

import {
  createChannelReplyPipeline as createChannelReplyPipelineCompat,
  createReplyPrefixContext as createReplyPrefixContextCompat,
  createReplyPrefixOptions as createReplyPrefixOptionsCompat,
  createTypingCallbacks as createTypingCallbacksCompat,
  resolveChannelSourceReplyDeliveryMode as resolveChannelSourceReplyDeliveryModeCompat,
  type ChannelReplyPipeline as ChannelReplyPipelineCompat,
  type CreateTypingCallbacksParams as CreateTypingCallbacksParamsCompat,
  type ReplyPrefixContext as ReplyPrefixContextCompat,
  type ReplyPrefixContextBundle as ReplyPrefixContextBundleCompat,
  type ReplyPrefixOptions as ReplyPrefixOptionsCompat,
  type SourceReplyDeliveryMode as SourceReplyDeliveryModeCompat,
  type TypingCallbacks as TypingCallbacksCompat,
} from "./channel-reply-core.js";

const shouldWarnCompatImport =
  process.env.VITEST !== "true" &&
  process.env.NODE_ENV !== "test" &&
  process.env.OPENCLAW_SUPPRESS_PLUGIN_SDK_COMPAT_WARNING !== "1";

if (shouldWarnCompatImport) {
  process.emitWarning(
    "openclaw/plugin-sdk/compat is deprecated for new plugins. Migrate to focused openclaw/plugin-sdk/<subpath> imports. See https://docs.openclaw.ai/plugins/sdk-migration",
    {
      code: "OPENCLAW_PLUGIN_SDK_COMPAT_DEPRECATED",
      detail:
        "Bundled plugins must use scoped plugin-sdk subpaths. External plugins may keep compat temporarily while migrating. Migration guide: https://docs.openclaw.ai/plugins/sdk-migration",
    },
  );
}

/** Legacy config-schema helper for plugins that have not moved to the config subpath. */
export { emptyPluginConfigSchema } from "../plugins/config-schema.js";
/** Legacy memory artifact contracts kept for older memory-capable plugins. */
export type {
  MemoryPluginCapability,
  MemoryPluginPublicArtifact,
  MemoryPluginPublicArtifactsProvider,
} from "../plugins/memory-state.js";
/** Legacy command-gating helper for channel plugins still importing through compat. */
export { resolveControlCommandGate } from "../channels/command-gating.js";
/** Legacy context compaction helpers retained until plugins adopt context-engine subpaths. */
export {
  buildMemorySystemPromptAddition,
  delegateCompactionToRuntime,
} from "../context-engine/delegate.js";
/** Legacy context-engine registration export for older plugin entrypoints. */
export { registerContextEngine } from "../context-engine/registry.js";
/** Legacy diagnostic event payload contract for plugins listening to host diagnostics. */
export type { DiagnosticEventPayload } from "../infra/diagnostic-events.js";
/** Legacy diagnostic event subscription helper. */
export { onDiagnosticEvent } from "../infra/diagnostic-events.js";
/** Legacy TypeBox enum helpers used by older plugin schemas. */
export { optionalStringEnum, stringEnum } from "../agents/schema/typebox.js";
/** Legacy provider credential helpers for plugins that have not moved to provider subpaths. */
export {
  applyAuthProfileConfig,
  buildApiKeyCredential,
  upsertApiKeyProfile,
  writeOAuthCredentials,
  type ApiKeyStorageOptions,
  type WriteOAuthCredentialsOptions,
} from "../plugins/provider-auth-helpers.js";

/** Legacy account-status sink export for channel lifecycle integrations. */
export { createAccountStatusSink } from "./channel-lifecycle.core.js";
/** Legacy runtime store export for plugins keeping process-local state through compat. */
export { createPluginRuntimeStore } from "./runtime-store.js";
/** Legacy keyed queue export for serialized plugin account work. */
export { KeyedAsyncQueue } from "./keyed-async-queue.js";
/** Legacy account id normalizer for channel plugins. */
export { normalizeAccountId } from "./account-id.js";
/** Legacy temp-dir resolver for plugins that need host-preferred scratch paths. */
export { resolvePreferredOpenClawTmpDir } from "./temp-path.js";

/** Legacy channel config adapter helpers retained for old channel plugin imports. */
export {
  createHybridChannelConfigAdapter,
  createHybridChannelConfigBase,
  createScopedAccountConfigAccessors,
  createScopedChannelConfigAdapter,
  createScopedChannelConfigBase,
  createScopedDmSecurityResolver,
  createTopLevelChannelConfigAdapter,
  createTopLevelChannelConfigBase,
  mapAllowFromEntries,
} from "./channel-config-helpers.js";
/** Legacy allowlist formatting helpers for channel configuration displays. */
export { formatAllowFromLowercase, formatNormalizedAllowFromEntries } from "./allow-from.js";
export * from "./channel-config-schema.js";
export * from "./channel-policy.js";
/** Legacy open-group route warning collector for channel policy validation. */
export { collectOpenGroupPolicyConfiguredRouteWarnings } from "./channel-policy.js";
export * from "./reply-history.js";
export * from "./directory-runtime.js";
/** Legacy allowlist mapping helper for channel policy resolution. */
export { mapAllowlistResolutionInputs } from "./allow-from.js";

/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
export const createChannelReplyPipeline = createChannelReplyPipelineCompat;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
export const createReplyPrefixContext = createReplyPrefixContextCompat;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
export const createReplyPrefixOptions = createReplyPrefixOptionsCompat;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
export const createTypingCallbacks = createTypingCallbacksCompat;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
export const resolveChannelSourceReplyDeliveryMode = resolveChannelSourceReplyDeliveryModeCompat;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
export type ChannelReplyPipeline = ChannelReplyPipelineCompat;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
export type CreateTypingCallbacksParams = CreateTypingCallbacksParamsCompat;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
export type ReplyPrefixContext = ReplyPrefixContextCompat;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
export type ReplyPrefixContextBundle = ReplyPrefixContextBundleCompat;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
export type ReplyPrefixOptions = ReplyPrefixOptionsCompat;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
export type SourceReplyDeliveryMode = SourceReplyDeliveryModeCompat;
/** @deprecated Use `openclaw/plugin-sdk/channel-outbound`. */
export type TypingCallbacks = TypingCallbacksCompat;
