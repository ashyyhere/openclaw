// tts provider registry helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.js";
import { getActiveRuntimePluginRegistry } from "../plugins/active-runtime-registry.js";
import {
  resolvePluginCapabilityProvider,
  resolvePluginCapabilityProviders,
} from "../plugins/capability-provider-runtime.js";
import type { SpeechProviderPlugin } from "../plugins/types.js";
/** Re-exported API for src/tts, starting with normalize Speech Provider Id. */
export { normalizeSpeechProviderId } from "./provider-registry-core.js";
import {
  createSpeechProviderRegistry,
  type SpeechProviderRegistryResolver,
} from "./provider-registry-core.js";

function resolveSpeechProviderPluginEntries(cfg?: OpenClawConfig): SpeechProviderPlugin[] {
  return resolvePluginCapabilityProviders({
    key: "speechProviders",
    cfg,
  });
}

function resolveLoadedSpeechProviderPluginEntries(): SpeechProviderPlugin[] {
  return (getActiveRuntimePluginRegistry()?.speechProviders ?? []).map((entry) => entry.provider);
}

const defaultSpeechProviderRegistryResolver: SpeechProviderRegistryResolver = {
  getProvider: (providerId, cfg) =>
    resolvePluginCapabilityProvider({
      key: "speechProviders",
      providerId,
      cfg,
    }),
  listProviders: resolveSpeechProviderPluginEntries,
};

const defaultSpeechProviderRegistry = createSpeechProviderRegistry(
  defaultSpeechProviderRegistryResolver,
);

const loadedSpeechProviderRegistry = createSpeechProviderRegistry({
  getProvider: (providerId) =>
    resolveLoadedSpeechProviderPluginEntries().find((provider) => {
      if (provider.id === providerId) {
        return true;
      }
      return provider.aliases?.includes(providerId) ?? false;
    }),
  listProviders: () => resolveLoadedSpeechProviderPluginEntries(),
});

/** Reused constant for list Speech Providers behavior in src/tts. */
export const listSpeechProviders = defaultSpeechProviderRegistry.listSpeechProviders;
/** Reused constant for list Loaded Speech Providers behavior in src/tts. */
export const listLoadedSpeechProviders = loadedSpeechProviderRegistry.listSpeechProviders;
/** Reused constant for get Speech Provider behavior in src/tts. */
export const getSpeechProvider = defaultSpeechProviderRegistry.getSpeechProvider;
/** Reused constant for canonicalize Speech Provider Id behavior in src/tts. */
export const canonicalizeSpeechProviderId =
  defaultSpeechProviderRegistry.canonicalizeSpeechProviderId;
