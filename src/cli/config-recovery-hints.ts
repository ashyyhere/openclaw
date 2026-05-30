import { formatCliCommand } from "./command-format.js";

/** Recovery hint shown when startup/config parsing blocks command execution. */
export function formatInvalidConfigRecoveryHint(): string {
  return [
    `Run "${formatCliCommand("openclaw doctor --fix")}" to repair, then retry.`,
    "If startup is still blocked, inspect the adjacent .bak backup before restoring it manually.",
  ].join("\n");
}

/** Recovery hint for plugins that ship source without compiled runtime output. */
export function formatPluginPackagingRuntimeOutputRecoveryHint(): string {
  return [
    "This is a plugin packaging issue, not a local config problem.",
    "Update or reinstall the plugin after the publisher ships compiled JavaScript, or disable/uninstall the plugin until then.",
  ].join("\n");
}
