// extensions/memory-wiki api helpers and runtime behavior.
/** Re-exported memory-wiki plugin public API. */
export {
  buildPluginConfigSchema,
  definePluginEntry,
  type AnyAgentTool,
  type OpenClawConfig,
  type OpenClawPluginApi,
  type OpenClawPluginConfigSchema,
} from "openclaw/plugin-sdk/plugin-entry";
/** Re-exported memory-wiki plugin public API, starting with z. */
export { z } from "zod";
