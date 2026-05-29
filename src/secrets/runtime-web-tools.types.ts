// Shared types for secrets runtime web tools types behavior.
/** Shared type for Runtime Web Diagnostic Code in src/secrets. */
export type RuntimeWebDiagnosticCode =
  | "WEB_SEARCH_PROVIDER_INVALID_AUTODETECT"
  | "WEB_SEARCH_AUTODETECT_SELECTED"
  | "WEB_SEARCH_KEY_UNRESOLVED_FALLBACK_USED"
  | "WEB_SEARCH_KEY_UNRESOLVED_NO_FALLBACK"
  | "WEB_FETCH_PROVIDER_INVALID_AUTODETECT"
  | "WEB_FETCH_AUTODETECT_SELECTED"
  | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_FALLBACK_USED"
  | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK";

/** Shared type for Runtime Web Diagnostic in src/secrets. */
export type RuntimeWebDiagnostic = {
  code: RuntimeWebDiagnosticCode;
  message: string;
  path?: string;
};

/** Shared type for Runtime Web Search Metadata in src/secrets. */
export type RuntimeWebSearchMetadata = {
  providerConfigured?: string;
  providerSource: "configured" | "auto-detect" | "none";
  selectedProvider?: string;
  selectedProviderKeySource?: "config" | "secretRef" | "env" | "missing";
  perplexityTransport?: "search_api" | "chat_completions";
  diagnostics: RuntimeWebDiagnostic[];
};

/** Shared type for Runtime Web Fetch Metadata in src/secrets. */
export type RuntimeWebFetchMetadata = {
  providerConfigured?: string;
  providerSource: "configured" | "auto-detect" | "none";
  selectedProvider?: string;
  selectedProviderKeySource?: "config" | "secretRef" | "env" | "missing";
  diagnostics: RuntimeWebDiagnostic[];
};

/** Shared type for Runtime Web Tools Metadata in src/secrets. */
export type RuntimeWebToolsMetadata = {
  search: RuntimeWebSearchMetadata;
  fetch: RuntimeWebFetchMetadata;
  diagnostics: RuntimeWebDiagnostic[];
};
