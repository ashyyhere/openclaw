// packages/memory-host-sdk/src/host embedding inputs helpers and runtime behavior.
/** Public type describing Embedding Input Text Part for packages/memory-host-sdk. */
export type EmbeddingInputTextPart = {
  type: "text";
  text: string;
};

/** Public type describing Embedding Input Inline Data Part for packages/memory-host-sdk. */
export type EmbeddingInputInlineDataPart = {
  type: "inline-data";
  mimeType: string;
  data: string;
};

/** Public type describing Embedding Input Part for packages/memory-host-sdk. */
export type EmbeddingInputPart = EmbeddingInputTextPart | EmbeddingInputInlineDataPart;

/** Public type describing Embedding Input for packages/memory-host-sdk. */
export type EmbeddingInput = {
  text: string;
  parts?: EmbeddingInputPart[];
};

/** Public helper for build Text Embedding Input behavior in packages/memory-host-sdk. */
export function buildTextEmbeddingInput(text: string): EmbeddingInput {
  return { text };
}

/** Public helper for is Inline Data Embedding Input Part behavior in packages/memory-host-sdk. */
export function isInlineDataEmbeddingInputPart(
  part: EmbeddingInputPart,
): part is EmbeddingInputInlineDataPart {
  return part.type === "inline-data";
}

/** Public helper for has Non Text Embedding Parts behavior in packages/memory-host-sdk. */
export function hasNonTextEmbeddingParts(input: EmbeddingInput | undefined): boolean {
  if (!input?.parts?.length) {
    return false;
  }
  return input.parts.some((part) => isInlineDataEmbeddingInputPart(part));
}
