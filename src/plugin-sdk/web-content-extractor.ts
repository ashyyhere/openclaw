/** Public SDK barrel for web content extraction contracts. */
export type {
  WebContentExtractionRequest,
  WebContentExtractionResult,
  WebContentExtractorPlugin,
  WebContentExtractMode,
} from "../plugins/web-content-extractor-types.js";
/** Re-exported API for src/plugin-sdk. */
export {
  extractBasicHtmlContent,
  htmlToMarkdown,
  markdownToText,
  normalizeWhitespace,
} from "../agents/tools/web-fetch-utils.js";
/** Re-exported API for src/plugin-sdk, starting with sanitize Html. */
export { sanitizeHtml, stripInvisibleUnicode } from "../agents/tools/web-fetch-visibility.js";
