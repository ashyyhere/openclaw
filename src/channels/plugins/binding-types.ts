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

/** Conversation reference matched by configured channel bindings. */
export type ConfiguredBindingConversation = ConversationRef;
/** Channel id used by configured binding rules. */
export type ConfiguredBindingChannel = ChannelId;
/** Config binding rule shape loaded from OpenClaw config. */
export type ConfiguredBindingRuleConfig = AgentBinding;

/** Persistable descriptor for a binding target owned by a stateful driver. */
export type StatefulBindingTargetDescriptor = {
  kind: "stateful";
  driverId: string;
  sessionKey: string;
  agentId: string;
  label?: string;
};

/** Stored binding record paired with its stateful target descriptor. */
export type ConfiguredBindingRecordResolution = {
  record: SessionBindingRecord;
  statefulTarget: StatefulBindingTargetDescriptor;
};

/** Factory that materializes a stateful binding target for a conversation. */
export type ConfiguredBindingTargetFactory = {
  driverId: string;
  materialize: (params: {
    accountId: string;
    conversation: ChannelConfiguredBindingConversationRef;
  }) => ConfiguredBindingRecordResolution;
};

/** Configured binding rule after channel/provider matching and target compilation. */
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

/** Full binding resolution returned after matching an inbound conversation. */
export type ConfiguredBindingResolution = ConfiguredBindingRecordResolution & {
  conversation: ConfiguredBindingConversation;
  compiledBinding: CompiledConfiguredBinding;
  match: ChannelConfiguredBindingMatch;
};
