// secrets target registry test helpers helpers and runtime behavior.
/** Reused helper for canonicalize Secret Target Coverage Id behavior in src/secrets. */
export function canonicalizeSecretTargetCoverageId(id: string): string {
  if (id === "tools.web.x_search.apiKey") {
    return "plugins.entries.xai.config.webSearch.apiKey";
  }
  if (id === "tools.web.fetch.firecrawl.apiKey") {
    return "plugins.entries.firecrawl.config.webFetch.apiKey";
  }
  return id;
}
