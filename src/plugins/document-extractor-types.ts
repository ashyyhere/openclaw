// plugins document extractor types helpers and runtime behavior.
/** Shared type for Document Extracted Image in src/plugins. */
export type DocumentExtractedImage = {
  type: "image";
  data: string;
  mimeType: string;
};

/** Shared type for Document Extraction Request in src/plugins. */
export type DocumentExtractionRequest = {
  buffer: Buffer;
  mimeType: string;
  maxPages: number;
  maxPixels: number;
  minTextChars: number;
  password?: string;
  pageNumbers?: number[];
  onImageExtractionError?: (error: unknown) => void;
};

/** Shared type for Document Extraction Result in src/plugins. */
export type DocumentExtractionResult = {
  text: string;
  images: DocumentExtractedImage[];
};

/** Shared type for Document Extractor Plugin in src/plugins. */
export type DocumentExtractorPlugin = {
  id: string;
  label: string;
  mimeTypes: readonly string[];
  autoDetectOrder?: number;
  extract: (request: DocumentExtractionRequest) => Promise<DocumentExtractionResult | null>;
};

/** Shared type for Plugin Document Extractor Entry in src/plugins. */
export type PluginDocumentExtractorEntry = DocumentExtractorPlugin & {
  pluginId: string;
};
