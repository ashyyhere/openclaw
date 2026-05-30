import { normalizeOptionalString } from "./string.js";

export type ParsedGenerationModelRef = {
  provider: string;
  model: string;
};

/** Parse a non-empty `provider/model` reference into provider and model components. */
export function parseGenerationModelRef(raw: string | undefined): ParsedGenerationModelRef | null {
  const trimmed = normalizeOptionalString(raw);
  if (!trimmed) {
    return null;
  }
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex <= 0 || slashIndex === trimmed.length - 1) {
    return null;
  }
  const provider = normalizeOptionalString(trimmed.slice(0, slashIndex));
  const model = normalizeOptionalString(trimmed.slice(slashIndex + 1));
  return provider && model ? { provider, model } : null;
}
