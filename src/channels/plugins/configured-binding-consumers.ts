// Configured binding consumer lookup and dispatch helpers.
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type {
  CompiledConfiguredBinding,
  ConfiguredBindingRecordResolution,
  ConfiguredBindingRuleConfig,
  ConfiguredBindingTargetFactory,
} from "./binding-types.js";
import type { ChannelConfiguredBindingConversationRef } from "./types.adapters.js";

/** Shared type for Parsed Configured Binding Session Key in src/channels/plugins. */
export type ParsedConfiguredBindingSessionKey = {
  channel: string;
  accountId: string;
};

/** Shared type for Configured Binding Consumer in src/channels/plugins. */
export type ConfiguredBindingConsumer = {
  id: string;
  supports: (binding: ConfiguredBindingRuleConfig) => boolean;
  buildTargetFactory: (params: {
    cfg: OpenClawConfig;
    binding: ConfiguredBindingRuleConfig;
    channel: string;
    agentId: string;
    target: ChannelConfiguredBindingConversationRef;
    bindingConversationId: string;
  }) => ConfiguredBindingTargetFactory | null;
  parseSessionKey?: (params: { sessionKey: string }) => ParsedConfiguredBindingSessionKey | null;
  matchesSessionKey?: (params: {
    sessionKey: string;
    compiledBinding: CompiledConfiguredBinding;
    accountId: string;
    materializedTarget: ConfiguredBindingRecordResolution;
  }) => boolean;
};

const registeredConfiguredBindingConsumers = new Map<string, ConfiguredBindingConsumer>();

/** Reused helper for list Configured Binding Consumers behavior in src/channels/plugins. */
export function listConfiguredBindingConsumers(): ConfiguredBindingConsumer[] {
  return [...registeredConfiguredBindingConsumers.values()];
}

/** Reused helper for resolve Configured Binding Consumer behavior in src/channels/plugins. */
export function resolveConfiguredBindingConsumer(
  binding: ConfiguredBindingRuleConfig,
): ConfiguredBindingConsumer | null {
  for (const consumer of listConfiguredBindingConsumers()) {
    if (consumer.supports(binding)) {
      return consumer;
    }
  }
  return null;
}

/** Reused helper for register Configured Binding Consumer behavior in src/channels/plugins. */
export function registerConfiguredBindingConsumer(consumer: ConfiguredBindingConsumer): void {
  const id = consumer.id.trim();
  if (!id) {
    throw new Error("Configured binding consumer id is required");
  }
  const existing = registeredConfiguredBindingConsumers.get(id);
  if (existing) {
    return;
  }
  registeredConfiguredBindingConsumers.set(id, {
    ...consumer,
    id,
  });
}
