// Pure channel contract types used by plugin implementations and tests.
/** Re-exported API for src/plugin-sdk. */
export type {
  BaseProbeResult,
  BaseTokenResolution,
  ChannelAgentTool,
  ChannelAccountSnapshot,
  ChannelApprovalAdapter,
  ChannelApprovalCapability,
  ChannelCommandConversationContext,
  ChannelCapabilities,
  ChannelDirectoryEntry,
  ChannelResolveKind,
  ChannelResolveResult,
  ChannelGroupContext,
  ChannelLogSink,
  ChannelMessageActionAdapter,
  ChannelMessageActionContext,
  ChannelMessageActionDiscoveryContext,
  ChannelMessageActionName,
  ChannelMessageToolDiscovery,
  ChannelMessageToolSchemaContribution,
  ChannelMeta,
  ChannelStructuredComponents,
  ChannelStatusIssue,
  ChannelThreadingContext,
  ChannelThreadingToolContext,
  ChannelToolSend,
} from "../channels/plugins/types.public.js";
/** Re-exported API for src/plugin-sdk, starting with Channel Legacy State Migration Plan. */
export type { ChannelLegacyStateMigrationPlan } from "../channels/plugins/types.core.js";

/** Re-exported API for src/plugin-sdk. */
export type {
  ChannelDirectoryAdapter,
  ChannelDoctorAdapter,
  ChannelDoctorConfigMutation,
  ChannelDoctorEmptyAllowlistAccountContext,
  ChannelDoctorLegacyConfigRule,
  ChannelDoctorSequenceResult,
  ChannelGatewayContext,
  ChannelOutboundAdapter,
  ChannelOutboundContext,
  ChannelOutboundPayloadHint,
  ChannelStatusAdapter,
} from "../channels/plugins/types.adapters.js";
/** Re-exported API for src/plugin-sdk, starting with Channel Runtime Surface. */
export type { ChannelRuntimeSurface } from "../channels/plugins/channel-runtime-surface.types.js";
