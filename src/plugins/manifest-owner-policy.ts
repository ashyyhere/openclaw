// Evaluates whether manifest-declared owner plugins are trusted and active enough to claim surfaces.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { normalizePluginsConfig, resolveEffectivePluginActivationState } from "./config-state.js";
import { isPluginEnabledByDefaultForPlatform } from "./default-enablement.js";
import type { PluginManifestRecord } from "./manifest-registry.js";

type OwnerPlugin = Pick<
  PluginManifestRecord,
  "id" | "origin" | "enabledByDefault" | "enabledByDefaultOnPlatforms"
>;

type NormalizedPluginsConfig = ReturnType<typeof normalizePluginsConfig>;

/** Base config-policy reason that prevents a manifest owner from being trusted. */
export type ManifestOwnerBasePolicyBlockReason =
  | "plugins-disabled"
  | "blocked-by-denylist"
  | "plugin-disabled"
  | "not-in-allowlist";

/** Bundled manifest owners are trusted by distribution provenance. */
export function isBundledManifestOwner(plugin: Pick<PluginManifestRecord, "origin">): boolean {
  return plugin.origin === "bundled";
}

/** Check whether config explicitly opts into trusting a manifest owner. */
export function hasExplicitManifestOwnerTrust(params: {
  plugin: Pick<PluginManifestRecord, "id">;
  normalizedConfig: NormalizedPluginsConfig;
}): boolean {
  return (
    params.normalizedConfig.allow.includes(params.plugin.id) ||
    params.normalizedConfig.entries[params.plugin.id]?.enabled === true
  );
}

/** Boolean wrapper for callers that only need the allow/block decision. */
export function passesManifestOwnerBasePolicy(params: {
  plugin: Pick<PluginManifestRecord, "id">;
  normalizedConfig: NormalizedPluginsConfig;
  allowExplicitlyDisabled?: boolean;
  allowRestrictiveAllowlistBypass?: boolean;
}): boolean {
  return resolveManifestOwnerBasePolicyBlock(params) === null;
}

/** Return the first config-policy block for a manifest owner, or null when allowed. */
export function resolveManifestOwnerBasePolicyBlock(params: {
  plugin: Pick<PluginManifestRecord, "id">;
  normalizedConfig: NormalizedPluginsConfig;
  allowExplicitlyDisabled?: boolean;
  allowRestrictiveAllowlistBypass?: boolean;
}): ManifestOwnerBasePolicyBlockReason | null {
  if (!params.normalizedConfig.enabled) {
    return "plugins-disabled";
  }
  if (params.normalizedConfig.deny.includes(params.plugin.id)) {
    return "blocked-by-denylist";
  }
  if (
    params.normalizedConfig.entries[params.plugin.id]?.enabled === false &&
    params.allowExplicitlyDisabled !== true
  ) {
    return "plugin-disabled";
  }
  if (
    params.allowRestrictiveAllowlistBypass !== true &&
    params.normalizedConfig.allow.length > 0 &&
    !params.normalizedConfig.allow.includes(params.plugin.id)
  ) {
    return "not-in-allowlist";
  }
  return null;
}

/** Resolve effective activation, including default enablement, for owner-backed surfaces. */
export function isActivatedManifestOwner(params: {
  plugin: OwnerPlugin;
  normalizedConfig: NormalizedPluginsConfig;
  rootConfig?: OpenClawConfig;
}): boolean {
  return resolveEffectivePluginActivationState({
    id: params.plugin.id,
    origin: params.plugin.origin,
    config: params.normalizedConfig,
    rootConfig: params.rootConfig,
    enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin),
  }).activated;
}
