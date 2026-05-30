// Test helpers for capturing provider registrations from plugin register hooks.
import { createCapturedPluginRegistration } from "../plugins/captured-registration.js";
import type {
  ImageGenerationProviderPlugin,
  MediaUnderstandingProviderPlugin,
  MusicGenerationProviderPlugin,
  OpenClawPluginApi,
  ProviderPlugin,
  RealtimeTranscriptionProviderPlugin,
  SpeechProviderPlugin,
  UnifiedModelCatalogProviderPlugin,
  VideoGenerationProviderPlugin,
} from "../plugins/types.js";

/** Capture plugin-sdk registrations without starting the full plugin runtime. */
export { createCapturedPluginRegistration };

type RegistrablePlugin = {
  register(api: OpenClawPluginApi): void;
};

/** Provider collections captured from a test plugin registration. */
export type RegisteredProviderCollections = {
  providers: ProviderPlugin[];
  realtimeTranscriptionProviders: RealtimeTranscriptionProviderPlugin[];
  speechProviders: SpeechProviderPlugin[];
  mediaProviders: MediaUnderstandingProviderPlugin[];
  imageProviders: ImageGenerationProviderPlugin[];
  musicProviders: MusicGenerationProviderPlugin[];
  videoProviders: VideoGenerationProviderPlugin[];
  modelCatalogProviders: UnifiedModelCatalogProviderPlugin[];
};

/** Register one provider hook and return the first captured generic provider. */
export async function registerSingleProviderPlugin(params: {
  register(api: OpenClawPluginApi): void;
}): Promise<ProviderPlugin> {
  const captured = createCapturedPluginRegistration();
  params.register(captured.api);
  const provider = captured.providers[0];
  if (!provider) {
    throw new Error("provider registration missing");
  }
  return provider;
}

/** Register a plugin and return every provider family it contributed. */
export async function registerProviderPlugin(params: {
  plugin: RegistrablePlugin;
  id: string;
  name: string;
}): Promise<RegisteredProviderCollections> {
  const captured = createCapturedPluginRegistration({
    id: params.id,
    name: params.name,
    source: "test",
  });
  params.plugin.register(captured.api);
  return {
    providers: captured.providers,
    realtimeTranscriptionProviders: captured.realtimeTranscriptionProviders,
    speechProviders: captured.speechProviders,
    mediaProviders: captured.mediaUnderstandingProviders,
    imageProviders: captured.imageGenerationProviders,
    musicProviders: captured.musicGenerationProviders,
    videoProviders: captured.videoGenerationProviders,
    modelCatalogProviders: captured.modelCatalogProviders,
  };
}

/** Register multiple plugins and return the captured generic providers. */
export async function registerProviderPlugins(
  ...plugins: RegistrablePlugin[]
): Promise<ProviderPlugin[]> {
  const captured = createCapturedPluginRegistration();
  for (const plugin of plugins) {
    plugin.register(captured.api);
  }
  return captured.providers;
}

function matchesRegisteredProviderId(
  entry: { id: string; hookAliases?: readonly string[] },
  id: string,
) {
  return entry.id === id || entry.hookAliases?.includes(id) === true;
}

export function requireRegisteredProvider<
  T extends { id: string; hookAliases?: readonly string[] },
>(providers: T[], providerId: string, label = "provider"): T {
  const provider = providers.find((entry) => matchesRegisteredProviderId(entry, providerId));
  if (!provider) {
    throw new Error(`${label} ${providerId} missing`);
  }
  return provider;
}
