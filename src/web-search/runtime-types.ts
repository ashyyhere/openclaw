/** Runtime-facing types for resolving and invoking web search providers. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type {
  PluginWebSearchProviderEntry,
  WebSearchProviderToolDefinition,
} from "../plugins/web-provider-types.js";
import type { RuntimeWebSearchMetadata } from "../secrets/runtime-web-tools.types.js";

type WebSearchConfig = NonNullable<OpenClawConfig["tools"]>["web"] extends infer Web
  ? Web extends { search?: infer Search }
    ? Search
    : undefined
  : undefined;

/** Inputs used to choose the active web search tool definition. */
export type ResolveWebSearchDefinitionParams = {
  config?: OpenClawConfig;
  agentDir?: string;
  sandboxed?: boolean;
  runtimeWebSearch?: RuntimeWebSearchMetadata;
  providerId?: string;
  preferRuntimeProviders?: boolean;
  preferInputConfig?: boolean;
};

/** Runtime request for invoking a selected web search provider. */
export type RunWebSearchParams = ResolveWebSearchDefinitionParams & {
  args: Record<string, unknown>;
  signal?: AbortSignal;
};

/** Normalized result returned after a web search provider runs. */
export type RunWebSearchResult = {
  provider: string;
  result: Record<string, unknown>;
};

/** Inputs for listing web search providers visible to the current config. */
export type ListWebSearchProvidersParams = {
  config?: OpenClawConfig;
};

/** Runtime alias for plugin web search provider entries. */
export type RuntimeWebSearchProviderEntry = PluginWebSearchProviderEntry;
/** Runtime alias for plugin-provided web search tool definitions. */
export type RuntimeWebSearchToolDefinition = WebSearchProviderToolDefinition;
/** Extracted config slice that controls runtime web search behavior. */
export type RuntimeWebSearchConfig = WebSearchConfig;
