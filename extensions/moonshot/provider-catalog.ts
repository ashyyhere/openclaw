// Moonshot model catalog helpers and native streaming usage compatibility.
import {
  buildManifestModelProviderConfig,
  applyProviderNativeStreamingUsageCompat,
  supportsNativeStreamingUsageCompat,
} from "openclaw/plugin-sdk/provider-catalog-shared";
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
import manifest from "./openclaw.plugin.json" with { type: "json" };

/** Default global Moonshot API base URL. */
export const MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1";
/** Mainland China Moonshot API base URL. */
export const MOONSHOT_CN_BASE_URL = "https://api.moonshot.cn/v1";
/** Default Kimi model id used for onboarding aliases. */
export const MOONSHOT_DEFAULT_MODEL_ID = "kimi-k2.6";

/** Checks whether a base URL is a native Moonshot endpoint with usage compat needs. */
export function isNativeMoonshotBaseUrl(baseUrl: string | undefined): boolean {
  return supportsNativeStreamingUsageCompat({
    providerId: "moonshot",
    baseUrl,
  });
}

/** Applies native streaming usage compatibility for Moonshot provider configs. */
export function applyMoonshotNativeStreamingUsageCompat(
  provider: ModelProviderConfig,
): ModelProviderConfig {
  return applyProviderNativeStreamingUsageCompat({
    providerId: "moonshot",
    providerConfig: provider,
  });
}

/** Builds the Moonshot model provider config from plugin manifest catalog data. */
export function buildMoonshotProvider(): ModelProviderConfig {
  return buildManifestModelProviderConfig({
    providerId: "moonshot",
    catalog: manifest.modelCatalog.providers.moonshot,
  });
}
