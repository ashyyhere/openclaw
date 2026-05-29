// Structured embedding input parts for text and inline multimodal data.
/** Text part in a structured embedding input. */
export type EmbeddingInputTextPart = {
  type: "text";
  text: string;
};

/** Inline binary payload encoded as base64 for multimodal embedding providers. */
export type EmbeddingInputInlineDataPart = {
  type: "inline-data";
  mimeType: string;
  data: string;
};

/** Structured embedding input part accepted by embedding providers. */
export type EmbeddingInputPart = EmbeddingInputTextPart | EmbeddingInputInlineDataPart;

/** Embedding input with plain text plus optional provider-specific structured parts. */
export type EmbeddingInput = {
  text: string;
  parts?: EmbeddingInputPart[];
};

/** Wraps plain text in the structured embedding input shape. */
export function buildTextEmbeddingInput(text: string): EmbeddingInput {
  return { text };
}

/** Type guard for inline-data embedding input parts. */
export function isInlineDataEmbeddingInputPart(
  part: EmbeddingInputPart,
): part is EmbeddingInputInlineDataPart {
  return part.type === "inline-data";
}

/** Returns true when an embedding input includes inline-data parts. */
export function hasNonTextEmbeddingParts(input: EmbeddingInput | undefined): boolean {
  if (!input?.parts?.length) {
    return false;
  }
  return input.parts.some((part) => isInlineDataEmbeddingInputPart(part));
}
