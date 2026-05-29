// plugins web content extractor types helpers and runtime behavior.
/** Shared type for Web Content Extract Mode in src/plugins. */
export type WebContentExtractMode = "markdown" | "text";

/** Shared type for Web Content Extraction Request in src/plugins. */
export type WebContentExtractionRequest = {
  html: string;
  url: string;
  extractMode: WebContentExtractMode;
};

/** Shared type for Web Content Extraction Result in src/plugins. */
export type WebContentExtractionResult = {
  text: string;
  title?: string;
};

/** Shared type for Web Content Extractor Plugin in src/plugins. */
export type WebContentExtractorPlugin = {
  id: string;
  label: string;
  autoDetectOrder?: number;
  extract: (request: WebContentExtractionRequest) => Promise<WebContentExtractionResult | null>;
};

/** Shared type for Plugin Web Content Extractor Entry in src/plugins. */
export type PluginWebContentExtractorEntry = WebContentExtractorPlugin & {
  pluginId: string;
};
