// Shared configured binding record types.
import type { AgentBinding } from "../../config/types.js";
import type {
  ConversationRef,
  SessionBindingRecord,
} from "../../infra/outbound/session-binding-service.js";
import type { ChannelConfiguredBindingConversationRef } from "./types.adapters.js";
import type {
  ChannelConfiguredBindingMatch,
  ChannelConfiguredBindingProvider,
} from "./types.adapters.js";
import type { ChannelId } from "./types.public.js";

/** Shared type for Configured Binding Conversation in src/channels/plugins. */
export type ConfiguredBindingConversation = ConversationRef;
/** Shared type for Configured Binding Channel in src/channels/plugins. */
export type ConfiguredBindingChannel = ChannelId;
/** Shared type for Configured Binding Rule Config in src/channels/plugins. */
export type ConfiguredBindingRuleConfig = AgentBinding;

/** Shared type for Stateful Binding Target Descriptor in src/channels/plugins. */
export type StatefulBindingTargetDescriptor = {
  kind: "stateful";
  driverId: string;
  sessionKey: string;
  agentId: string;
  label?: string;
};

/** Shared type for Configured Binding Record Resolution in src/channels/plugins. */
export type ConfiguredBindingRecordResolution = {
  record: SessionBindingRecord;
  statefulTarget: StatefulBindingTargetDescriptor;
};

/** Shared type for Configured Binding Target Factory in src/channels/plugins. */
export type ConfiguredBindingTargetFactory = {
  driverId: string;
  materialize: (params: {
    accountId: string;
    conversation: ChannelConfiguredBindingConversationRef;
  }) => ConfiguredBindingRecordResolution;
};

/** Shared type for Compiled Configured Binding in src/channels/plugins. */
export type CompiledConfiguredBinding = {
  channel: ConfiguredBindingChannel;
  accountPattern?: string;
  binding: ConfiguredBindingRuleConfig;
  bindingConversationId: string;
  target: ChannelConfiguredBindingConversationRef;
  agentId: string;
  provider: ChannelConfiguredBindingProvider;
  targetFactory: ConfiguredBindingTargetFactory;
};

/** Shared type for Configured Binding Resolution in src/channels/plugins. */
export type ConfiguredBindingResolution = ConfiguredBindingRecordResolution & {
  conversation: ConfiguredBindingConversation;
  compiledBinding: CompiledConfiguredBinding;
  match: ChannelConfiguredBindingMatch;
};
