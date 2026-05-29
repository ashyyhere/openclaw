// extensions/diffs api helpers and runtime behavior.
/** Re-exported diffs plugin public API, starting with Open Claw Config. */
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
/** Re-exported diffs plugin public API. */
export {
  definePluginEntry,
  type AnyAgentTool,
  type OpenClawPluginApi,
  type OpenClawPluginConfigSchema,
  type OpenClawPluginToolContext,
  type PluginLogger,
} from "openclaw/plugin-sdk/plugin-entry";
/** Re-exported diffs plugin public API, starting with resolve Preferred Open Claw Tmp Dir. */
export { resolvePreferredOpenClawTmpDir } from "openclaw/plugin-sdk/temp-path";
