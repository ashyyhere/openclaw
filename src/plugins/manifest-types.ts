// plugins manifest types helpers and runtime behavior.
/** Shared type for Plugin Config Ui Hint in src/plugins. */
export type PluginConfigUiHint = {
  label?: string;
  help?: string;
  tags?: string[];
  advanced?: boolean;
  sensitive?: boolean;
  placeholder?: string;
};

/** Shared type for Plugin Format in src/plugins. */
export type PluginFormat = "openclaw" | "bundle";

/** Shared type for Plugin Bundle Format in src/plugins. */
export type PluginBundleFormat = "codex" | "claude" | "cursor";

/** Shared type for Plugin Diagnostic in src/plugins. */
export type PluginDiagnostic = {
  level: "warn" | "error";
  message: string;
  pluginId?: string;
  source?: string;
};
