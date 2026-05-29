import { normalizeProviderId } from "@openclaw/model-catalog-core/provider-id";
import { normalizeModelRef } from "../agents/model-selection.js";
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";

/** Shared type for Cached Pricing Tier in src/gateway. */
export type CachedPricingTier = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  /** [startTokens, endTokens) — half-open interval on the input token axis. */
  range: [number, number];
};

/** Shared type for Cached Model Pricing in src/gateway. */
export type CachedModelPricing = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
  /** Optional tiered pricing tiers sourced from LiteLLM or local config. */
  tieredPricing?: CachedPricingTier[];
};

/** Shared type for Gateway Model Pricing Health Source in src/gateway. */
export type GatewayModelPricingHealthSource = "openrouter" | "litellm" | "bootstrap" | "refresh";

/** Shared type for Gateway Model Pricing Health in src/gateway. */
export type GatewayModelPricingHealth = {
  state: "ok" | "degraded" | "disabled";
  sources: Array<{
    source: GatewayModelPricingHealthSource;
    state: "ok" | "degraded";
    lastFailureAt?: number;
    detail?: string;
  }>;
  lastFailureAt?: number;
  detail?: string;
};

let cachedPricing = new Map<string, CachedModelPricing>();
let cachedAt = 0;
const sourceFailures = new Map<
  GatewayModelPricingHealthSource,
  { lastFailureAt: number; detail: string }
>();

function modelPricingCacheKey(provider: string, model: string): string {
  const providerId = normalizeProviderId(provider);
  const modelId = model.trim();
  if (!providerId || !modelId) {
    return "";
  }
  return normalizeLowercaseStringOrEmpty(modelId).startsWith(
    `${normalizeLowercaseStringOrEmpty(providerId)}/`,
  )
    ? modelId
    : `${providerId}/${modelId}`;
}

/** Reused helper for replace Gateway Model Pricing Cache behavior in src/gateway. */
export function replaceGatewayModelPricingCache(
  nextPricing: Map<string, CachedModelPricing>,
  nextCachedAt = Date.now(),
): void {
  cachedPricing = nextPricing;
  cachedAt = nextCachedAt;
}

/** Reused helper for clear Gateway Model Pricing Cache State behavior in src/gateway. */
export function clearGatewayModelPricingCacheState(): void {
  cachedPricing = new Map();
  cachedAt = 0;
  clearGatewayModelPricingFailures();
}

/** Reused helper for record Gateway Model Pricing Source Failure behavior in src/gateway. */
export function recordGatewayModelPricingSourceFailure(
  source: GatewayModelPricingHealthSource,
  detail: string,
  failedAt = Date.now(),
): void {
  sourceFailures.set(source, {
    lastFailureAt: failedAt,
    detail,
  });
}

/** Reused helper for clear Gateway Model Pricing Source Failure behavior in src/gateway. */
export function clearGatewayModelPricingSourceFailure(
  source: GatewayModelPricingHealthSource,
): void {
  sourceFailures.delete(source);
}

/** Reused helper for clear Gateway Model Pricing Failures behavior in src/gateway. */
export function clearGatewayModelPricingFailures(): void {
  sourceFailures.clear();
}

/** Reused helper for get Gateway Model Pricing Health behavior in src/gateway. */
export function getGatewayModelPricingHealth(params?: {
  enabled?: boolean;
}): GatewayModelPricingHealth {
  if (params?.enabled === false) {
    return {
      state: "disabled",
      sources: [],
    };
  }
  const sources: GatewayModelPricingHealth["sources"] = Array.from(sourceFailures.entries())
    .map(([source, failure]) => ({
      source,
      state: "degraded" as const,
      lastFailureAt: failure.lastFailureAt,
      detail: failure.detail,
    }))
    .toSorted((left, right) => left.source.localeCompare(right.source));
  const latest = sources.reduce<(typeof sources)[number] | undefined>((current, source) => {
    if (!current || (source.lastFailureAt ?? 0) > (current.lastFailureAt ?? 0)) {
      return source;
    }
    return current;
  }, undefined);
  return {
    state: sources.length > 0 ? "degraded" : "ok",
    sources,
    ...(latest?.lastFailureAt ? { lastFailureAt: latest.lastFailureAt } : {}),
    ...(latest?.detail ? { detail: latest.detail } : {}),
  };
}

/** Reused helper for get Cached Gateway Model Pricing behavior in src/gateway. */
export function getCachedGatewayModelPricing(params: {
  provider?: string;
  model?: string;
}): CachedModelPricing | undefined {
  const provider = params.provider?.trim();
  const model = params.model?.trim();
  if (!provider || !model) {
    return undefined;
  }
  const key = modelPricingCacheKey(provider, model);
  const direct = key ? cachedPricing.get(key) : undefined;
  if (direct) {
    return direct;
  }
  const normalized = normalizeModelRef(provider, model);
  const normalizedKey = modelPricingCacheKey(normalized.provider, normalized.model);
  if (normalizedKey === key) {
    return undefined;
  }
  return normalizedKey ? cachedPricing.get(normalizedKey) : undefined;
}

/** Reused helper for get Gateway Model Pricing Cache Meta behavior in src/gateway. */
export function getGatewayModelPricingCacheMeta(): {
  cachedAt: number;
  ttlMs: number;
  size: number;
} {
  return {
    cachedAt,
    ttlMs: 0,
    size: cachedPricing.size,
  };
}

function stablePricingValue(value: unknown): string {
  if (typeof value === "number") {
    return Number.isFinite(value) ? JSON.stringify(value) : JSON.stringify(String(value));
  }
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stablePricingValue(entry)).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .filter((key) => record[key] !== undefined)
    .toSorted()
    .map((key) => `${JSON.stringify(key)}:${stablePricingValue(record[key])}`)
    .join(",")}}`;
}

/** Reused helper for get Gateway Model Pricing Cache Fingerprint behavior in src/gateway. */
export function getGatewayModelPricingCacheFingerprint(): string {
  const entries = Array.from(cachedPricing.entries()).toSorted(([a], [b]) => a.localeCompare(b));
  return stablePricingValue(entries);
}

/** Reused helper for reset Gateway Model Pricing Cache For Test behavior in src/gateway. */
export function resetGatewayModelPricingCacheForTest(): void {
  clearGatewayModelPricingCacheState();
}

/** Reused helper for set Gateway Model Pricing For Test behavior in src/gateway. */
export function setGatewayModelPricingForTest(
  entries: Array<{ provider: string; model: string; pricing: CachedModelPricing }>,
): void {
  replaceGatewayModelPricingCache(
    new Map(
      entries.flatMap((entry) => {
        const normalized = normalizeModelRef(entry.provider, entry.model, {
          allowPluginNormalization: false,
        });
        const key = modelPricingCacheKey(normalized.provider, normalized.model);
        return key ? ([[key, entry.pricing]] as const) : [];
      }),
    ),
  );
}
