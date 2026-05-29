// extensions/tavily web search contract api helpers and runtime behavior.
import { type WebSearchProviderPlugin } from "openclaw/plugin-sdk/provider-web-search-contract";
import { buildTavilyWebSearchProviderBase } from "./web-search-shared.js";

export function createTavilyWebSearchProvider(): WebSearchProviderPlugin {
  return {
    ...buildTavilyWebSearchProviderBase(),
    createTool: () => null,
  };
}
