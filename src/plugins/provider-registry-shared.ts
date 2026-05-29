// plugins provider registry shared helpers and runtime behavior.
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";

/** Reused helper for normalize Capability Provider Id behavior in src/plugins. */
export function normalizeCapabilityProviderId(providerId: string | undefined): string | undefined {
  return normalizeOptionalLowercaseString(providerId);
}

/** Reused helper for build Capability Provider Maps behavior in src/plugins. */
export function buildCapabilityProviderMaps<T extends { id: string; aliases?: readonly string[] }>(
  providers: readonly T[],
  normalizeId: (
    providerId: string | undefined,
  ) => string | undefined = normalizeCapabilityProviderId,
): {
  canonical: Map<string, T>;
  aliases: Map<string, T>;
} {
  const canonical = new Map<string, T>();
  const aliases = new Map<string, T>();

  for (const provider of providers) {
    const id = normalizeId(provider.id);
    if (!id) {
      continue;
    }
    canonical.set(id, provider);
    aliases.set(id, provider);
    for (const alias of provider.aliases ?? []) {
      const normalizedAlias = normalizeId(alias);
      if (normalizedAlias) {
        aliases.set(normalizedAlias, provider);
      }
    }
  }

  return { canonical, aliases };
}
