/** Helpers for provider model compatibility metadata and normalization. */
import { detectOpenAICompletionsCompat } from "../agents/openai-completions-compat.js";
import type { ModelCompatConfig } from "../config/types.models.js";
import type { Model } from "../llm/types.js";
import { normalizeStringEntries } from "../shared/string-normalization.js";

/** Extracts a compat object from either a model or raw compat config. */
export function extractModelCompat(
  modelOrCompat: { compat?: unknown } | ModelCompatConfig | undefined,
): ModelCompatConfig | undefined {
  if (!modelOrCompat || typeof modelOrCompat !== "object") {
    return undefined;
  }
  if ("compat" in modelOrCompat) {
    const compat = (modelOrCompat as { compat?: unknown }).compat;
    return compat && typeof compat === "object" ? (compat as ModelCompatConfig) : undefined;
  }
  return modelOrCompat as ModelCompatConfig;
}

/** @deprecated Provider-owned model compat helper; do not use from third-party plugins. */
export function applyModelCompatPatch<T extends { compat?: ModelCompatConfig }>(
  model: T,
  patch: Partial<ModelCompatConfig> & Record<string, unknown>,
): T {
  const nextCompat = { ...model.compat, ...patch } as ModelCompatConfig;
  const currentCompat = model.compat as (Record<string, unknown> & ModelCompatConfig) | undefined;
  if (
    model.compat &&
    Object.entries(patch).every(([key, value]) => currentCompat?.[key] === value)
  ) {
    return model;
  }
  return {
    ...model,
    compat: nextCompat,
  };
}

/** Checks whether a model advertises a specific tool schema profile. */
export function hasToolSchemaProfile(
  modelOrCompat: { compat?: unknown } | ModelCompatConfig | undefined,
  profile: string,
): boolean {
  return extractModelCompat(modelOrCompat)?.toolSchemaProfile === profile;
}

/** Checks whether a model should use provider-native web search tooling. */
export function hasNativeWebSearchTool(
  modelOrCompat: { compat?: unknown } | ModelCompatConfig | undefined,
): boolean {
  return extractModelCompat(modelOrCompat)?.nativeWebSearchTool === true;
}

/** Resolves the tool-call argument encoding override for a model. */
export function resolveToolCallArgumentsEncoding(
  modelOrCompat: { compat?: unknown } | ModelCompatConfig | undefined,
): ModelCompatConfig["toolCallArgumentsEncoding"] | undefined {
  return extractModelCompat(modelOrCompat)?.toolCallArgumentsEncoding;
}

/** Returns unsupported JSON schema keywords advertised by model compat config. */
export function resolveUnsupportedToolSchemaKeywords(
  modelOrCompat: { compat?: unknown } | ModelCompatConfig | undefined,
): ReadonlySet<string> {
  const keywords = extractModelCompat(modelOrCompat)?.unsupportedToolSchemaKeywords ?? [];
  return new Set(
    normalizeStringEntries(
      keywords.filter((keyword): keyword is string => typeof keyword === "string"),
    ),
  );
}

/** Checks provider compat for omitting empty array item schemas. */
export function shouldOmitEmptyArrayItems(
  modelOrCompat: { compat?: unknown } | ModelCompatConfig | undefined,
): boolean {
  const compat = extractModelCompat(modelOrCompat) as
    | (ModelCompatConfig & { omitEmptyArrayItems?: unknown })
    | undefined;
  return compat?.omitEmptyArrayItems === true;
}

function isOpenAiCompletionsModel(model: Model): model is Model<"openai-completions"> {
  return model.api === "openai-completions";
}

function isAnthropicMessagesModel(model: Model): model is Model<"anthropic-messages"> {
  return model.api === "anthropic-messages";
}

function normalizeAnthropicBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/v1\/?$/, "");
}

/** Applies provider-specific compatibility defaults to a model definition. */
export function normalizeModelCompat(model: Model): Model {
  const baseUrl = model.baseUrl ?? "";

  if (isAnthropicMessagesModel(model) && baseUrl) {
    const normalized = normalizeAnthropicBaseUrl(baseUrl);
    if (normalized !== baseUrl) {
      return { ...model, baseUrl: normalized } as Model<"anthropic-messages">;
    }
  }

  if (!isOpenAiCompletionsModel(model)) {
    return model;
  }

  const compat = model.compat ?? undefined;
  const detectedCompatDefaults = baseUrl
    ? detectOpenAICompletionsCompat(model).defaults
    : undefined;
  const needsForce = Boolean(
    detectedCompatDefaults &&
    (!detectedCompatDefaults.supportsDeveloperRole ||
      !detectedCompatDefaults.supportsUsageInStreaming ||
      !detectedCompatDefaults.supportsStrictMode),
  );
  if (!needsForce) {
    return model;
  }
  const forcedDeveloperRole = compat?.supportsDeveloperRole === true;
  const hasStreamingUsageOverride = compat?.supportsUsageInStreaming !== undefined;
  const targetStrictMode = compat?.supportsStrictMode ?? detectedCompatDefaults?.supportsStrictMode;
  if (
    compat?.supportsDeveloperRole !== undefined &&
    hasStreamingUsageOverride &&
    compat?.supportsStrictMode !== undefined
  ) {
    return model;
  }

  return {
    ...model,
    compat: compat
      ? {
          ...compat,
          supportsDeveloperRole: forcedDeveloperRole || false,
          ...(hasStreamingUsageOverride
            ? {}
            : {
                supportsUsageInStreaming: detectedCompatDefaults?.supportsUsageInStreaming ?? false,
              }),
          supportsStrictMode: targetStrictMode,
        }
      : {
          supportsDeveloperRole: false,
          supportsUsageInStreaming: detectedCompatDefaults?.supportsUsageInStreaming ?? false,
          supportsStrictMode: detectedCompatDefaults?.supportsStrictMode ?? false,
        },
  } as typeof model;
}
