// Test helpers for comparing legacy and canonical secret target ids.
/** Maps compatibility aliases to canonical secret target ids for coverage assertions. */
export function canonicalizeSecretTargetCoverageId(id: string): string {
  if (id === "tools.web.x_search.apiKey") {
    return "plugins.entries.xai.config.webSearch.apiKey";
  }
  if (id === "tools.web.fetch.firecrawl.apiKey") {
    return "plugins.entries.firecrawl.config.webFetch.apiKey";
  }
  return id;
}
