// extensions/firecrawl api helpers and runtime behavior.
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import { readStringValue } from "openclaw/plugin-sdk/string-coerce-runtime";
import { runFirecrawlScrape } from "./src/firecrawl-client.js";

/** Public firecrawl plugin type for Fetch Firecrawl Content Params. */
export type FetchFirecrawlContentParams = {
  url: string;
  extractMode: "markdown" | "text";
  apiKey: string;
  baseUrl: string;
  onlyMainContent: boolean;
  maxAgeMs: number;
  proxy: "auto" | "basic" | "stealth";
  storeInCache: boolean;
  timeoutSeconds: number;
  maxChars?: number;
};

/** Public firecrawl plugin type for Fetch Firecrawl Content Result. */
export type FetchFirecrawlContentResult = {
  text: string;
  title?: string;
  finalUrl?: string;
  status?: number;
  warning?: string;
};

/** Public firecrawl plugin helper for fetch Firecrawl Content behavior. */
export async function fetchFirecrawlContent(
  params: FetchFirecrawlContentParams,
): Promise<FetchFirecrawlContentResult> {
  const cfg: OpenClawConfig = {
    plugins: {
      entries: {
        firecrawl: {
          enabled: true,
          config: {
            webFetch: {
              apiKey: params.apiKey,
              baseUrl: params.baseUrl,
              onlyMainContent: params.onlyMainContent,
              maxAgeMs: params.maxAgeMs,
              timeoutSeconds: params.timeoutSeconds,
            },
          },
        },
      },
    },
  };

  const result = await runFirecrawlScrape({
    cfg,
    url: params.url,
    extractMode: params.extractMode,
    maxChars: params.maxChars,
    proxy: params.proxy,
    storeInCache: params.storeInCache,
    onlyMainContent: params.onlyMainContent,
    maxAgeMs: params.maxAgeMs,
    timeoutSeconds: params.timeoutSeconds,
  });

  return {
    text: typeof result.text === "string" ? result.text : "",
    title: readStringValue(result.title),
    finalUrl: readStringValue(result.finalUrl),
    status: typeof result.status === "number" ? result.status : undefined,
    warning: readStringValue(result.warning),
  };
}
