// plugins/contracts speech vitest registry helpers and runtime behavior.
import { loadBundledCapabilityRuntimeRegistry } from "../bundled-capability-runtime.js";
import type {
  ImageGenerationProviderPlugin,
  MediaUnderstandingProviderPlugin,
  TranscriptSourceProvider,
  MusicGenerationProviderPlugin,
  RealtimeTranscriptionProviderPlugin,
  RealtimeVoiceProviderPlugin,
  SpeechProviderPlugin,
  VideoGenerationProviderPlugin,
} from "../types.js";
import { BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS } from "./inventory/bundled-capability-metadata.js";

/** Shared type for Speech Provider Contract Entry in src/plugins/contracts. */
export type SpeechProviderContractEntry = {
  pluginId: string;
  provider: SpeechProviderPlugin;
};

/** Shared type for Media Understanding Provider Contract Entry in src/plugins/contracts. */
export type MediaUnderstandingProviderContractEntry = {
  pluginId: string;
  provider: MediaUnderstandingProviderPlugin;
};

/** Shared type for Transcripts Source Provider Contract Entry in src/plugins/contracts. */
export type TranscriptsSourceProviderContractEntry = {
  pluginId: string;
  provider: TranscriptSourceProvider;
};

/** Shared type for Realtime Voice Provider Contract Entry in src/plugins/contracts. */
export type RealtimeVoiceProviderContractEntry = {
  pluginId: string;
  provider: RealtimeVoiceProviderPlugin;
};

/** Shared type for Realtime Transcription Provider Contract Entry in src/plugins/contracts. */
export type RealtimeTranscriptionProviderContractEntry = {
  pluginId: string;
  provider: RealtimeTranscriptionProviderPlugin;
};

/** Shared type for Image Generation Provider Contract Entry in src/plugins/contracts. */
export type ImageGenerationProviderContractEntry = {
  pluginId: string;
  provider: ImageGenerationProviderPlugin;
};

/** Shared type for Video Generation Provider Contract Entry in src/plugins/contracts. */
export type VideoGenerationProviderContractEntry = {
  pluginId: string;
  provider: VideoGenerationProviderPlugin;
};

/** Shared type for Music Generation Provider Contract Entry in src/plugins/contracts. */
export type MusicGenerationProviderContractEntry = {
  pluginId: string;
  provider: MusicGenerationProviderPlugin;
};

type ManifestContractKey =
  | "imageGenerationProviders"
  | "speechProviders"
  | "mediaUnderstandingProviders"
  | "transcriptSourceProviders"
  | "realtimeVoiceProviders"
  | "realtimeTranscriptionProviders"
  | "videoGenerationProviders"
  | "musicGenerationProviders";

const VITEST_CONTRACT_PLUGIN_IDS = {
  imageGenerationProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.imageGenerationProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
  speechProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.speechProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
  mediaUnderstandingProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.mediaUnderstandingProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
  transcriptSourceProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.transcriptSourceProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
  realtimeVoiceProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.realtimeVoiceProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
  realtimeTranscriptionProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.realtimeTranscriptionProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
  videoGenerationProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.videoGenerationProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
  musicGenerationProviders: BUNDLED_PLUGIN_CONTRACT_SNAPSHOTS.filter(
    (entry) => entry.musicGenerationProviderIds.length > 0,
  ).map((entry) => entry.pluginId),
} satisfies Record<ManifestContractKey, string[]>;

function loadVitestVideoGenerationFallbackEntries(
  pluginIds: readonly string[],
): VideoGenerationProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "videoGenerationProviders",
    pluginSdkResolution: "src",
    pluginIds,
    pickEntries: (registry) =>
      registry.videoGenerationProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

function loadVitestMusicGenerationFallbackEntries(
  pluginIds: readonly string[],
): MusicGenerationProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "musicGenerationProviders",
    pluginSdkResolution: "src",
    pluginIds,
    pickEntries: (registry) =>
      registry.musicGenerationProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

function loadVitestSpeechFallbackEntries(
  pluginIds: readonly string[],
): SpeechProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "speechProviders",
    pluginSdkResolution: "src",
    pluginIds,
    pickEntries: (registry) =>
      registry.speechProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

function hasExplicitVideoGenerationModes(provider: VideoGenerationProviderPlugin): boolean {
  return Boolean(
    provider.capabilities.generate &&
    provider.capabilities.imageToVideo &&
    provider.capabilities.videoToVideo,
  );
}

function hasExplicitMusicGenerationModes(provider: MusicGenerationProviderPlugin): boolean {
  return Boolean(provider.capabilities.generate && provider.capabilities.edit);
}

function loadVitestCapabilityContractEntries<T>(params: {
  contract: ManifestContractKey;
  pluginIds?: readonly string[];
  pluginSdkResolution?: "dist" | "src";
  pickEntries: (registry: ReturnType<typeof loadBundledCapabilityRuntimeRegistry>) => Array<{
    pluginId: string;
    provider: T;
  }>;
}): Array<{ pluginId: string; provider: T }> {
  const pluginIds = [...(params.pluginIds ?? VITEST_CONTRACT_PLUGIN_IDS[params.contract])];
  if (pluginIds.length === 0) {
    return [];
  }
  const bulkEntries = params.pickEntries(
    loadBundledCapabilityRuntimeRegistry({
      pluginIds,
      pluginSdkResolution: params.pluginSdkResolution ?? "dist",
    }),
  );
  const coveredPluginIds = new Set(bulkEntries.map((entry) => entry.pluginId));
  if (coveredPluginIds.size === pluginIds.length) {
    return bulkEntries;
  }
  return pluginIds.flatMap((pluginId) =>
    params
      .pickEntries(
        loadBundledCapabilityRuntimeRegistry({
          pluginIds: [pluginId],
          pluginSdkResolution: params.pluginSdkResolution ?? "dist",
        }),
      )
      .filter((entry) => entry.pluginId === pluginId),
  );
}

/** Reused helper for load Vitest Speech Provider Contract Registry behavior in src/plugins/contracts. */
export function loadVitestSpeechProviderContractRegistry(): SpeechProviderContractEntry[] {
  const entries = loadVitestCapabilityContractEntries({
    contract: "speechProviders",
    pickEntries: (registry) =>
      registry.speechProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
  const coveredPluginIds = new Set(entries.map((entry) => entry.pluginId));
  const missingPluginIds = VITEST_CONTRACT_PLUGIN_IDS.speechProviders.filter(
    (pluginId) => !coveredPluginIds.has(pluginId),
  );
  if (missingPluginIds.length === 0) {
    return entries;
  }
  const replacementEntries = loadVitestSpeechFallbackEntries(missingPluginIds);
  const replacedPluginIds = new Set(replacementEntries.map((entry) => entry.pluginId));
  return [
    ...entries.filter((entry) => !replacedPluginIds.has(entry.pluginId)),
    ...replacementEntries,
  ];
}

/** Reused helper for load Vitest Media Understanding Provider Contract Registry behavior in src/plugins/contracts. */
export function loadVitestMediaUnderstandingProviderContractRegistry(): MediaUnderstandingProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "mediaUnderstandingProviders",
    pickEntries: (registry) =>
      registry.mediaUnderstandingProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

/** Reused helper for load Vitest Transcripts Source Provider Contract Registry behavior in src/plugins/contracts. */
export function loadVitestTranscriptsSourceProviderContractRegistry(): TranscriptsSourceProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "transcriptSourceProviders",
    pluginSdkResolution: "src",
    pickEntries: (registry) =>
      registry.transcriptSourceProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

/** Reused helper for load Vitest Realtime Voice Provider Contract Registry behavior in src/plugins/contracts. */
export function loadVitestRealtimeVoiceProviderContractRegistry(): RealtimeVoiceProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "realtimeVoiceProviders",
    pickEntries: (registry) =>
      registry.realtimeVoiceProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

/** Reused helper for load Vitest Realtime Transcription Provider Contract Registry behavior in src/plugins/contracts. */
export function loadVitestRealtimeTranscriptionProviderContractRegistry(): RealtimeTranscriptionProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "realtimeTranscriptionProviders",
    pickEntries: (registry) =>
      registry.realtimeTranscriptionProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

/** Reused helper for load Vitest Image Generation Provider Contract Registry behavior in src/plugins/contracts. */
export function loadVitestImageGenerationProviderContractRegistry(): ImageGenerationProviderContractEntry[] {
  return loadVitestCapabilityContractEntries({
    contract: "imageGenerationProviders",
    pickEntries: (registry) =>
      registry.imageGenerationProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
}

/** Reused helper for load Vitest Video Generation Provider Contract Registry behavior in src/plugins/contracts. */
export function loadVitestVideoGenerationProviderContractRegistry(): VideoGenerationProviderContractEntry[] {
  const entries = loadVitestCapabilityContractEntries({
    contract: "videoGenerationProviders",
    pickEntries: (registry) =>
      registry.videoGenerationProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
  const coveredPluginIds = new Set(entries.map((entry) => entry.pluginId));
  const stalePluginIds = new Set(
    entries
      .filter((entry) => !hasExplicitVideoGenerationModes(entry.provider))
      .map((entry) => entry.pluginId),
  );
  const missingPluginIds = VITEST_CONTRACT_PLUGIN_IDS.videoGenerationProviders.filter(
    (pluginId) => !coveredPluginIds.has(pluginId) || stalePluginIds.has(pluginId),
  );
  if (missingPluginIds.length === 0) {
    return entries;
  }
  const replacementEntries = loadVitestVideoGenerationFallbackEntries(missingPluginIds);
  const replacedPluginIds = new Set(replacementEntries.map((entry) => entry.pluginId));
  return [
    ...entries.filter((entry) => !replacedPluginIds.has(entry.pluginId)),
    ...replacementEntries,
  ];
}

/** Reused helper for load Vitest Music Generation Provider Contract Registry behavior in src/plugins/contracts. */
export function loadVitestMusicGenerationProviderContractRegistry(): MusicGenerationProviderContractEntry[] {
  const entries = loadVitestCapabilityContractEntries({
    contract: "musicGenerationProviders",
    pickEntries: (registry) =>
      registry.musicGenerationProviders.map((entry) => ({
        pluginId: entry.pluginId,
        provider: entry.provider,
      })),
  });
  const coveredPluginIds = new Set(entries.map((entry) => entry.pluginId));
  const stalePluginIds = new Set(
    entries
      .filter((entry) => !hasExplicitMusicGenerationModes(entry.provider))
      .map((entry) => entry.pluginId),
  );
  const missingPluginIds = VITEST_CONTRACT_PLUGIN_IDS.musicGenerationProviders.filter(
    (pluginId) => !coveredPluginIds.has(pluginId) || stalePluginIds.has(pluginId),
  );
  if (missingPluginIds.length === 0) {
    return entries;
  }
  const replacementEntries = loadVitestMusicGenerationFallbackEntries(missingPluginIds);
  const replacedPluginIds = new Set(replacementEntries.map((entry) => entry.pluginId));
  return [
    ...entries.filter((entry) => !replacedPluginIds.has(entry.pluginId)),
    ...replacementEntries,
  ];
}
