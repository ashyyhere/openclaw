// ui/src/ui select options helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "./string-coerce.ts";

/** Shared type for Select Option in ui/src/ui. */
export type SelectOption = {
  value: string;
  label: string;
};

/** Reused helper for push Unique Trimmed Select Option behavior in ui/src/ui. */
export function pushUniqueTrimmedSelectOption(
  options: SelectOption[],
  seen: Set<string>,
  value: string,
  labelForValue: (trimmed: string) => string,
) {
  const trimmed = value.trim();
  if (!trimmed) {
    return;
  }
  const key = normalizeLowercaseStringOrEmpty(trimmed);
  if (seen.has(key)) {
    return;
  }
  seen.add(key);
  options.push({ value: trimmed, label: labelForValue(trimmed) });
}
