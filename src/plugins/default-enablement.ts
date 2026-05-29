// plugins default enablement helpers and runtime behavior.
/** Shared type for Plugin Default Enablement in src/plugins. */
export type PluginDefaultEnablement = {
  enabledByDefault?: boolean;
  enabledByDefaultOnPlatforms?: readonly string[];
};

/** Reused helper for is Plugin Enabled By Default For Platform behavior in src/plugins. */
export function isPluginEnabledByDefaultForPlatform(
  plugin: PluginDefaultEnablement,
  platform: NodeJS.Platform = process.platform,
): boolean {
  if (plugin.enabledByDefault === true) {
    return true;
  }
  return plugin.enabledByDefaultOnPlatforms?.includes(platform) === true;
}
