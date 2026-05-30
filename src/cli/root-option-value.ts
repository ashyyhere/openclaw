import { isValueToken } from "../infra/cli-root-options.js";
import { parseInlineOptionToken } from "../infra/inline-option-token.js";

/** Reads an inline or following-token value for a root CLI option. */
export function takeCliRootOptionValue(
  raw: string,
  next: string | undefined,
): {
  value: string | null;
  consumedNext: boolean;
} {
  const parsed = parseInlineOptionToken(raw);
  if (parsed.hasInlineValue) {
    const trimmed = (parsed.inlineValue ?? "").trim();
    return { value: trimmed || null, consumedNext: false };
  }
  const consumedNext = isValueToken(next);
  const trimmed = consumedNext ? next!.trim() : "";
  return { value: trimmed || null, consumedNext };
}
