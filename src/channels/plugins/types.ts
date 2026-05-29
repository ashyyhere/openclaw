/** Internal barrel for channel plugin runtime types and capabilities. */
import type { ChannelMessageActionName as ChannelMessageActionNameFromList } from "./message-action-names.js";

/** Re-exported API for src/channels/plugins, starting with CHANNEL MESSAGE ACTION NAMES. */
export { CHANNEL_MESSAGE_ACTION_NAMES } from "./message-action-names.js";
/** Re-exported API for src/channels/plugins, starting with CHANNEL MESSAGE CAPABILITIES. */
export { CHANNEL_MESSAGE_CAPABILITIES } from "./message-capabilities.js";

/** Shared type for Channel Message Action Name in src/channels/plugins. */
export type ChannelMessageActionName = ChannelMessageActionNameFromList;
/** Re-exported API for src/channels/plugins, starting with Channel Message Capability. */
export type { ChannelMessageCapability } from "./message-capabilities.js";

/** Re-exported API for src/channels/plugins. */
export type {
  ChannelActionAvailabilityState,
  ChannelApprovalAdapter,
  ChannelApprovalCapability,
  ChannelApprovalForwardTarget,
  ChannelApprovalInitiatingSurfaceState,
  ChannelAuthAdapter,
  ChannelCommandAdapter,
  ChannelCapabilitiesDiagnostics,
  ChannelCapabilitiesDisplayLine,
  ChannelCapabilitiesDisplayTone,
  ChannelConfigAdapter,
  ChannelDirectoryAdapter,
  ChannelResolveKind,
  ChannelResolveResult,
  ChannelResolverAdapter,
  ChannelElevatedAdapter,
  ChannelGatewayAdapter,
  ChannelGatewayContext,
  ChannelGroupAdapter,
  ChannelHeartbeatAdapter,
  ChannelLifecycleAdapter,
  ChannelLoginWithQrStartResult,
  ChannelLoginWithQrWaitResult,
  ChannelLogoutContext,
  ChannelLogoutResult,
  ChannelOutboundAdapter,
  ChannelOutboundChunkContext,
  ChannelOutboundContext,
  ChannelOutboundPayloadHint,
  ChannelOutboundTargetRef,
  ChannelAllowlistAdapter,
  ChannelSecretsAdapter,
  ChannelCommandConversationContext,
  ChannelConfiguredBindingConversationRef,
  ChannelConfiguredBindingMatch,
  ChannelConfiguredBindingProvider,
  ChannelConversationBindingSupport,
  ChannelPairingAdapter,
  ChannelSecurityAdapter,
  ChannelSetupAdapter,
  ChannelStatusAdapter,
} from "./types.adapters.js";
/** Re-exported API for src/channels/plugins, starting with Channel Runtime Surface. */
export type { ChannelRuntimeSurface } from "./channel-runtime-surface.types.js";
/** Re-exported API for src/channels/plugins. */
export type {
  ChannelAccountSnapshot,
  ChannelAccountState,
  ChannelAgentPromptAdapter,
  ChannelAgentTool,
  ChannelAgentToolFactory,
  ChannelCapabilities,
  ChannelDirectoryEntry,
  ChannelDirectoryEntryKind,
  ChannelGroupContext,
  ChannelHeartbeatDeps,
  ChannelId,
  ChannelLogSink,
  ChannelMentionAdapter,
  ChannelMessageActionAdapter,
  ChannelMessageActionDiscoveryContext,
  ChannelMessageActionContext,
  ChannelMessagingAdapter,
  ChannelMessageToolDiscovery,
  ChannelMeta,
  ChannelMessageToolSchemaContribution,
  ChannelOutboundTargetMode,
  ChannelPollContext,
  ChannelPollResult,
  ChannelSecurityContext,
  ChannelSecurityDmPolicy,
  ChannelSetupInput,
  ChannelStatusIssue,
  ChannelStreamingAdapter,
  ChannelStructuredComponents,
  ChannelCrossContextPresentationFactory,
  ChannelThreadingAdapter,
  ChannelThreadingContext,
  ChannelThreadingToolContext,
  ChannelToolSend,
  BaseProbeResult,
  BaseTokenResolution,
} from "./types.core.js";

/** Re-exported API for src/channels/plugins, starting with Channel Plugin. */
export type { ChannelPlugin } from "./types.plugin.js";
