import { normalizeProviderId } from "@openclaw/model-catalog-core/provider-id";
import type { PluginManifestRecord } from "./manifest-registry.js";

type SetupDescriptorRecord = Pick<
  PluginManifestRecord,
  "providers" | "cliBackends" | "providerAuthAliases" | "setup"
>;

/** Reused helper for list Setup Provider Ids behavior in src/plugins. */
export function listSetupProviderIds(record: SetupDescriptorRecord): readonly string[] {
  const providerIds = record.setup?.providers?.map((entry) => entry.id) ?? record.providers;
  const normalizedProviderIds = new Set(providerIds.map(normalizeProviderId));
  const aliases = Object.entries(record.providerAuthAliases ?? {})
    .filter(([, target]) => normalizedProviderIds.has(normalizeProviderId(target)))
    .map(([alias]) => alias);
  return [...providerIds, ...aliases];
}

/** Reused helper for list Setup Cli Backend Ids behavior in src/plugins. */
export function listSetupCliBackendIds(record: SetupDescriptorRecord): readonly string[] {
  return record.setup?.cliBackends ?? record.cliBackends;
}
