// Memory host SDK input shapes for text and multimodal embedding providers.
/** Text part included in an embedding input. */
export type EmbeddingInputTextPart = {
  type: "text";
  text: string;
};

/** Inline binary payload part included in an embedding input. */
export type EmbeddingInputInlineDataPart = {
  type: "inline-data";
  mimeType: string;
  data: string;
};

/** Union of embedding input parts supported by memory providers. */
export type EmbeddingInputPart = EmbeddingInputTextPart | EmbeddingInputInlineDataPart;

/** Canonical embedding request input passed across the memory host boundary. */
export type EmbeddingInput = {
  text: string;
  parts?: EmbeddingInputPart[];
};

/** Build a text-only embedding input. */
export function buildTextEmbeddingInput(text: string): EmbeddingInput {
  return { text };
}

function isInlineDataEmbeddingInputPart(
  part: EmbeddingInputPart,
): part is EmbeddingInputInlineDataPart {
  return part.type === "inline-data";
}

/** Detect whether an embedding input contains inline data in addition to text. */
export function hasNonTextEmbeddingParts(input: EmbeddingInput | undefined): boolean {
  if (!input?.parts?.length) {
    return false;
  }
  return input.parts.some((part) => isInlineDataEmbeddingInputPart(part));
}
