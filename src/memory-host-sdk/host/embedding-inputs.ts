// memory-host-sdk/host embedding inputs helpers and runtime behavior.
/** Shared type for Embedding Input Text Part in src/memory-host-sdk/host. */
export type EmbeddingInputTextPart = {
  type: "text";
  text: string;
};

/** Shared type for Embedding Input Inline Data Part in src/memory-host-sdk/host. */
export type EmbeddingInputInlineDataPart = {
  type: "inline-data";
  mimeType: string;
  data: string;
};

/** Shared type for Embedding Input Part in src/memory-host-sdk/host. */
export type EmbeddingInputPart = EmbeddingInputTextPart | EmbeddingInputInlineDataPart;

/** Shared type for Embedding Input in src/memory-host-sdk/host. */
export type EmbeddingInput = {
  text: string;
  parts?: EmbeddingInputPart[];
};

/** Reused helper for build Text Embedding Input behavior in src/memory-host-sdk/host. */
export function buildTextEmbeddingInput(text: string): EmbeddingInput {
  return { text };
}

function isInlineDataEmbeddingInputPart(
  part: EmbeddingInputPart,
): part is EmbeddingInputInlineDataPart {
  return part.type === "inline-data";
}

/** Reused helper for has Non Text Embedding Parts behavior in src/memory-host-sdk/host. */
export function hasNonTextEmbeddingParts(input: EmbeddingInput | undefined): boolean {
  if (!input?.parts?.length) {
    return false;
  }
  return input.parts.some((part) => isInlineDataEmbeddingInputPart(part));
}
