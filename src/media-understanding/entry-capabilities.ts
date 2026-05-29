// Capability resolution for media-understanding model entries from shared and
// capability-specific config.
import type { MediaUnderstandingModelConfig } from "../config/types.tools.js";
import { normalizeMediaProviderId } from "./provider-id.js";
import type {
  MediaUnderstandingCapability,
  MediaUnderstandingCapabilityRegistry,
} from "./types.js";

const MEDIA_CAPABILITIES = ["audio", "image", "video"] as const;

function isMediaCapability(value: unknown): value is MediaUnderstandingCapability {
  return typeof value === "string" && (MEDIA_CAPABILITIES as readonly string[]).includes(value);
}

function resolveEntryType(entry: MediaUnderstandingModelConfig): "provider" | "cli" {
  return entry.type ?? (entry.command ? "cli" : "provider");
}

/** Return valid media capabilities explicitly configured on a model entry. */
export function resolveConfiguredMediaEntryCapabilities(
  entry: MediaUnderstandingModelConfig,
): MediaUnderstandingCapability[] | undefined {
  if (!Array.isArray(entry.capabilities)) {
    return undefined;
  }
  const capabilities = entry.capabilities.filter(isMediaCapability);
  return capabilities.length > 0 ? capabilities : undefined;
}

/** Resolve capabilities from entry config or provider registry defaults. */
export function resolveEffectiveMediaEntryCapabilities(params: {
  entry: MediaUnderstandingModelConfig;
  source: "shared" | "capability";
  providerRegistry: MediaUnderstandingCapabilityRegistry;
}): MediaUnderstandingCapability[] | undefined {
  const configured = resolveConfiguredMediaEntryCapabilities(params.entry);
  if (configured) {
    return configured;
  }
  if (params.source !== "shared") {
    return undefined;
  }
  if (resolveEntryType(params.entry) === "cli") {
    return undefined;
  }
  const providerId = normalizeMediaProviderId(params.entry.provider ?? "");
  if (!providerId) {
    return undefined;
  }
  return params.providerRegistry.get(providerId)?.capabilities;
}

/** Return true when a model entry can satisfy the requested media capability. */
export function matchesMediaEntryCapability(params: {
  entry: MediaUnderstandingModelConfig;
  source: "shared" | "capability";
  capability: MediaUnderstandingCapability;
  providerRegistry: MediaUnderstandingCapabilityRegistry;
}): boolean {
  const capabilities = resolveEffectiveMediaEntryCapabilities(params);
  if (!capabilities || capabilities.length === 0) {
    return params.source === "capability";
  }
  return capabilities.includes(params.capability);
}
