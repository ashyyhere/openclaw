import { normalizeProviderId } from "@openclaw/model-catalog-core/provider-id";
import type { ModelProviderConfig } from "../config/types.js";
import {
  normalizeLowercaseStringOrEmpty,
  normalizeOptionalString,
} from "../shared/string-coerce.js";
import type { ProviderCatalogContext, ProviderCatalogResult } from "./types.js";

/** Reused helper for find Catalog Template behavior in src/plugins. */
export function findCatalogTemplate(params: {
  entries: ReadonlyArray<{ provider: string; id: string }>;
  providerId: string;
  templateIds: readonly string[];
}) {
  return params.templateIds
    .map((templateId) =>
      params.entries.find(
        (entry) =>
          normalizeProviderId(entry.provider) === normalizeProviderId(params.providerId) &&
          normalizeLowercaseStringOrEmpty(entry.id) === normalizeLowercaseStringOrEmpty(templateId),
      ),
    )
    .find((entry) => entry !== undefined);
}

/** Reused helper for build Single Provider Api Key Catalog behavior in src/plugins. */
export async function buildSingleProviderApiKeyCatalog(params: {
  ctx: ProviderCatalogContext;
  providerId: string;
  buildProvider: () => ModelProviderConfig | Promise<ModelProviderConfig>;
  allowExplicitBaseUrl?: boolean;
}): Promise<ProviderCatalogResult> {
  const providerId = normalizeProviderId(params.providerId);
  const apiKey = params.ctx.resolveProviderApiKey(providerId).apiKey;
  if (!apiKey) {
    return null;
  }

  const explicitProvider =
    params.allowExplicitBaseUrl && params.ctx.config.models?.providers
      ? Object.entries(params.ctx.config.models.providers).find(
          ([configuredProviderId]) => normalizeProviderId(configuredProviderId) === providerId,
        )?.[1]
      : undefined;
  const explicitBaseUrl = normalizeOptionalString(explicitProvider?.baseUrl) ?? "";

  return {
    provider: {
      ...(await params.buildProvider()),
      ...(explicitBaseUrl ? { baseUrl: explicitBaseUrl } : {}),
      apiKey,
    },
  };
}

/** Reused helper for build Paired Provider Api Key Catalog behavior in src/plugins. */
export async function buildPairedProviderApiKeyCatalog(params: {
  ctx: ProviderCatalogContext;
  providerId: string;
  buildProviders: () =>
    | Record<string, ModelProviderConfig>
    | Promise<Record<string, ModelProviderConfig>>;
}): Promise<ProviderCatalogResult> {
  const apiKey = params.ctx.resolveProviderApiKey(normalizeProviderId(params.providerId)).apiKey;
  if (!apiKey) {
    return null;
  }

  const providers = await params.buildProviders();
  return {
    providers: Object.fromEntries(
      Object.entries(providers).map(([id, provider]) => [id, { ...provider, apiKey }]),
    ),
  };
}
