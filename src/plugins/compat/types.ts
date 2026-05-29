// Shared types for plugins/compat types behavior.
/** Shared type for Plugin Compat Status in src/plugins/compat. */
export type PluginCompatStatus = "active" | "deprecated" | "removal-pending" | "removed";

/** Shared type for Plugin Compat Owner in src/plugins/compat. */
export type PluginCompatOwner =
  | "agent-runtime"
  | "channel"
  | "config"
  | "core"
  | "plugin-execution"
  | "provider"
  | "sdk"
  | "setup";

/** Shared type for Plugin Compat Record in src/plugins/compat. */
export type PluginCompatRecord<Code extends string = string> = {
  code: Code;
  status: PluginCompatStatus;
  owner: PluginCompatOwner;
  introduced: string;
  deprecated?: string;
  warningStarts?: string;
  removeAfter?: string;
  replacement?: string;
  docsPath: string;
  surfaces: readonly string[];
  diagnostics: readonly string[];
  tests: readonly string[];
  releaseNote?: string;
};
