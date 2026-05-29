// extensions/xai api helpers and runtime behavior.
import { normalizeProviderId } from "openclaw/plugin-sdk/provider-model-shared";
import {
  normalizeOptionalLowercaseString,
  readStringValue,
} from "openclaw/plugin-sdk/string-coerce-runtime";
import {
  applyXaiModelCompat,
  HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING,
  normalizeNativeXaiModelId,
  XAI_TOOL_SCHEMA_PROFILE,
} from "./model-compat.js";

/** Re-exported xai plugin public API, starting with build Xai Provider. */
export { buildXaiProvider } from "./provider-catalog.js";
/** Re-exported xai plugin public API, starting with apply Xai Config. */
export { applyXaiConfig, applyXaiProviderConfig } from "./onboard.js";
/** Re-exported xai plugin public API, starting with build Xai Image Generation Provider. */
export { buildXaiImageGenerationProvider } from "./image-generation-provider.js";
/** Re-exported xai plugin public API. */
export {
  buildXaiCatalogModels,
  buildXaiModelDefinition,
  resolveXaiCatalogEntry,
  XAI_BASE_URL,
  XAI_DEFAULT_CONTEXT_WINDOW,
  XAI_DEFAULT_IMAGE_MODEL,
  XAI_DEFAULT_MODEL_ID,
  XAI_DEFAULT_MODEL_REF,
  XAI_DEFAULT_MAX_TOKENS,
  XAI_IMAGE_MODELS,
} from "./model-definitions.js";
/** Re-exported xai plugin public API, starting with is Modern Xai Model. */
export { isModernXaiModel, resolveXaiForwardCompatModel } from "./provider-models.js";
/** Re-exported xai plugin public API, starting with apply Xai Runtime Model Compat. */
export { applyXaiRuntimeModelCompat } from "./runtime-model-compat.js";
/** Re-exported xai plugin public API, starting with apply Xai Model Compat. */
export { applyXaiModelCompat, HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING, XAI_TOOL_SCHEMA_PROFILE };

const XAI_NATIVE_ENDPOINT_HOSTS = new Set(["api.x.ai"]);

function resolveHostname(value: string): string | undefined {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

function isXaiNativeEndpoint(baseUrl: unknown): boolean {
  return (
    typeof baseUrl === "string" && XAI_NATIVE_ENDPOINT_HOSTS.has(resolveHostname(baseUrl) ?? "")
  );
}

/** Public xai plugin helper for is Xai Model Hint behavior. */
export function isXaiModelHint(modelId: string): boolean {
  return getModelProviderHint(modelId) === "x-ai";
}

/** Re-exported xai plugin public API, starting with normalize Native Xai Model Id. */
export { normalizeNativeXaiModelId as normalizeXaiModelId };

function getModelProviderHint(modelId: string): string | null {
  const trimmed = normalizeOptionalLowercaseString(modelId);
  if (!trimmed) {
    return null;
  }
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex <= 0) {
    return null;
  }
  return trimmed.slice(0, slashIndex) || null;
}

function shouldUseXaiResponsesTransport(params: {
  provider: string;
  api?: unknown;
  baseUrl?: unknown;
}): boolean {
  if (params.api !== "openai-completions") {
    return false;
  }
  if (isXaiNativeEndpoint(params.baseUrl)) {
    return true;
  }
  return normalizeProviderId(params.provider) === "xai" && !params.baseUrl;
}

/** Public xai plugin helper for resolve Xai Transport behavior. */
export function resolveXaiTransport(params: {
  provider: string;
  api?: unknown;
  baseUrl?: unknown;
}): { api: "openai-responses"; baseUrl?: string } | undefined {
  if (!shouldUseXaiResponsesTransport(params)) {
    return undefined;
  }
  return {
    api: "openai-responses",
    baseUrl: readStringValue(params.baseUrl),
  };
}

/** Public xai plugin helper for resolve Xai Base Url behavior. */
export function resolveXaiBaseUrl(baseUrlOrConfig?: unknown): string {
  let candidate = baseUrlOrConfig;
  if (
    baseUrlOrConfig &&
    typeof baseUrlOrConfig === "object" &&
    !Array.isArray(baseUrlOrConfig) &&
    "cfg" in baseUrlOrConfig
  ) {
    candidate =
      (baseUrlOrConfig as { cfg?: { models?: { providers?: { xai?: { baseUrl?: unknown } } } } })
        .cfg?.models?.providers?.xai?.baseUrl ?? baseUrlOrConfig;
  }
  return readStringValue(candidate) || "https://api.x.ai/v1";
}
