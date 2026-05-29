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

/** Re-exported API for src/plugin-sdk, starting with empty Plugin Config Schema. */
export { emptyPluginConfigSchema } from "../plugins/config-schema.js";
/** Re-exported API for src/plugin-sdk. */
export type {
  MemoryPluginCapability,
  MemoryPluginPublicArtifact,
  MemoryPluginPublicArtifactsProvider,
} from "../plugins/memory-state.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Control Command Gate. */
export { resolveControlCommandGate } from "../channels/command-gating.js";
/** Re-exported API for src/plugin-sdk. */
export {
  buildMemorySystemPromptAddition,
  delegateCompactionToRuntime,
} from "../context-engine/delegate.js";
/** Re-exported API for src/plugin-sdk, starting with register Context Engine. */
export { registerContextEngine } from "../context-engine/registry.js";
/** Re-exported API for src/plugin-sdk, starting with Diagnostic Event Payload. */
export type { DiagnosticEventPayload } from "../infra/diagnostic-events.js";
/** Re-exported API for src/plugin-sdk, starting with on Diagnostic Event. */
export { onDiagnosticEvent } from "../infra/diagnostic-events.js";
/** Re-exported API for src/plugin-sdk, starting with optional String Enum. */
export { optionalStringEnum, stringEnum } from "../agents/schema/typebox.js";
/** Re-exported API for src/plugin-sdk. */
export {
  applyAuthProfileConfig,
  buildApiKeyCredential,
  upsertApiKeyProfile,
  writeOAuthCredentials,
  type ApiKeyStorageOptions,
  type WriteOAuthCredentialsOptions,
} from "../plugins/provider-auth-helpers.js";

/** Re-exported API for src/plugin-sdk, starting with create Account Status Sink. */
export { createAccountStatusSink } from "./channel-lifecycle.core.js";
/** Re-exported API for src/plugin-sdk, starting with create Plugin Runtime Store. */
export { createPluginRuntimeStore } from "./runtime-store.js";
/** Re-exported API for src/plugin-sdk, starting with Keyed Async Queue. */
export { KeyedAsyncQueue } from "./keyed-async-queue.js";
/** Re-exported API for src/plugin-sdk, starting with normalize Account Id. */
export { normalizeAccountId } from "./account-id.js";
/** Re-exported API for src/plugin-sdk, starting with resolve Preferred Open Claw Tmp Dir. */
export { resolvePreferredOpenClawTmpDir } from "./temp-path.js";

/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk, starting with format Allow From Lowercase. */
export { formatAllowFromLowercase, formatNormalizedAllowFromEntries } from "./allow-from.js";
export * from "./channel-config-schema.js";
export * from "./channel-policy.js";
/** Re-exported API for src/plugin-sdk, starting with collect Open Group Policy Configured Route Warnings. */
export { collectOpenGroupPolicyConfiguredRouteWarnings } from "./channel-policy.js";
export * from "./reply-history.js";
export * from "./directory-runtime.js";
/** Re-exported API for src/plugin-sdk, starting with map Allowlist Resolution Inputs. */
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
