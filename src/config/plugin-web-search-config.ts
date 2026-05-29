// config plugin web search config helpers and runtime behavior.
import { isRecord } from "../shared/record-coerce.js";

type PluginWebSearchConfigCarrier = {
  plugins?: {
    entries?: Record<
      string,
      {
        config?: unknown;
      }
    >;
  };
};

/** Reused helper for resolve Plugin Web Search Config behavior in src/config. */
export function resolvePluginWebSearchConfig(
  config: PluginWebSearchConfigCarrier | undefined,
  pluginId: string,
): Record<string, unknown> | undefined {
  const pluginConfig = config?.plugins?.entries?.[pluginId]?.config;
  if (!isRecord(pluginConfig)) {
    return undefined;
  }
  return isRecord(pluginConfig.webSearch) ? pluginConfig.webSearch : undefined;
}
