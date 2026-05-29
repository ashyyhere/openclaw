// web-search runtime types helpers and runtime behavior.
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

/** Shared type for Resolve Web Search Definition Params in src/web-search. */
export type ResolveWebSearchDefinitionParams = {
  config?: OpenClawConfig;
  agentDir?: string;
  sandboxed?: boolean;
  runtimeWebSearch?: RuntimeWebSearchMetadata;
  providerId?: string;
  preferRuntimeProviders?: boolean;
  preferInputConfig?: boolean;
};

/** Shared type for Run Web Search Params in src/web-search. */
export type RunWebSearchParams = ResolveWebSearchDefinitionParams & {
  args: Record<string, unknown>;
  signal?: AbortSignal;
};

/** Shared type for Run Web Search Result in src/web-search. */
export type RunWebSearchResult = {
  provider: string;
  result: Record<string, unknown>;
};

/** Shared type for List Web Search Providers Params in src/web-search. */
export type ListWebSearchProvidersParams = {
  config?: OpenClawConfig;
};

/** Shared type for Runtime Web Search Provider Entry in src/web-search. */
export type RuntimeWebSearchProviderEntry = PluginWebSearchProviderEntry;
/** Shared type for Runtime Web Search Tool Definition in src/web-search. */
export type RuntimeWebSearchToolDefinition = WebSearchProviderToolDefinition;
/** Shared type for Runtime Web Search Config in src/web-search. */
export type RuntimeWebSearchConfig = WebSearchConfig;
