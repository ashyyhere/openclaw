// Metadata helpers for migrating formerly bundled plugins to external packages.
/** Preferred install source for an externalized bundled plugin bridge. */
export type ExternalizedBundledPluginPreferredSource = "npm" | "clawhub";

/** Mapping from a legacy bundled plugin id to its external package metadata. */
export type ExternalizedBundledPluginBridge = {
  /** Plugin id used while the plugin was bundled in core. */
  bundledPluginId: string;
  /** Plugin id declared by the external package. Defaults to bundledPluginId. */
  pluginId?: string;
  /** Preferred external source when migrating the bundled plugin out. Defaults to npm. */
  preferredSource?: ExternalizedBundledPluginPreferredSource;
  /** npm spec OpenClaw can install when migrating the bundled plugin out. */
  npmSpec?: string;
  /** ClawHub spec OpenClaw can install when migrating the bundled plugin out. */
  clawhubSpec?: string;
  /** Optional ClawHub base URL for non-default registries. */
  clawhubUrl?: string;
  /** Bundled directory name, when it differs from bundledPluginId. */
  bundledDirName?: string;
  /** Previous bundled manifest default enablement from the persisted registry. */
  enabledByDefault?: boolean;
  /** Legacy ids that should be treated as this plugin during enablement checks. */
  legacyPluginIds?: readonly string[];
  /** Channel ids that imply this plugin is enabled when configured. */
  channelIds?: readonly string[];
  /** Plugin ids this external package supersedes for channel selection. */
  preferOver?: readonly string[];
};

function normalizePluginId(value: string | undefined): string {
  return value?.trim() ?? "";
}

function normalizeOptionalSpec(value: string | undefined): string {
  return value?.trim() ?? "";
}

/** Resolves the preferred install source for an externalized bundled plugin. */
export function getExternalizedBundledPluginPreferredSource(
  bridge: ExternalizedBundledPluginBridge,
): ExternalizedBundledPluginPreferredSource {
  if (bridge.preferredSource === "clawhub") {
    return "clawhub";
  }
  if (bridge.preferredSource === "npm") {
    return "npm";
  }
  return normalizeOptionalSpec(bridge.clawhubSpec) && !normalizeOptionalSpec(bridge.npmSpec)
    ? "clawhub"
    : "npm";
}

/** Returns the normalized npm install spec for an externalized bundled plugin. */
export function getExternalizedBundledPluginNpmSpec(
  bridge: ExternalizedBundledPluginBridge,
): string {
  return normalizeOptionalSpec(bridge.npmSpec);
}

/** Returns the normalized ClawHub install spec for an externalized bundled plugin. */
export function getExternalizedBundledPluginClawHubSpec(
  bridge: ExternalizedBundledPluginBridge,
): string {
  return normalizeOptionalSpec(bridge.clawhubSpec);
}

/** Resolves the external plugin id that should be installed/enabled. */
export function getExternalizedBundledPluginTargetId(
  bridge: ExternalizedBundledPluginBridge,
): string {
  return normalizePluginId(bridge.pluginId) || normalizePluginId(bridge.bundledPluginId);
}

/** Lists legacy, bundled, channel, and external ids that should match this bridge. */
export function getExternalizedBundledPluginLookupIds(
  bridge: ExternalizedBundledPluginBridge,
): readonly string[] {
  return Array.from(
    new Set(
      [
        bridge.bundledPluginId,
        bridge.pluginId,
        ...(bridge.legacyPluginIds ?? []),
        ...(bridge.channelIds ?? []),
      ]
        .map(normalizePluginId)
        .filter(Boolean),
    ),
  );
}

/** Returns the old bundled path suffix used to detect legacy installs. */
export function getExternalizedBundledPluginLegacyPathSuffix(
  bridge: ExternalizedBundledPluginBridge,
): string {
  const bundledDirName = bridge.bundledDirName ?? bridge.bundledPluginId;
  return ["extensions", bundledDirName].join("/");
}
