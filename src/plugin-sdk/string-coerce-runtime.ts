// Narrow primitive coercion helpers for plugins that do not need the full text-runtime barrel.

/** String coercion helpers kept in this narrow barrel for plugin runtime code. */
export {
  hasNonEmptyString,
  localeLowercasePreservingWhitespace,
  lowercasePreservingWhitespace,
  normalizeFastMode,
  normalizeLowercaseStringOrEmpty,
  normalizeNullableString,
  normalizeOptionalLowercaseString,
  normalizeOptionalString,
  normalizeOptionalStringifiedId,
  normalizeStringifiedEntries,
  normalizeStringifiedOptionalString,
  readStringValue,
} from "../shared/string-coerce.js";
/** Numeric coercion helpers exposed without importing the larger utility barrel. */
export {
  asFiniteNumberInRange,
  asFiniteNumber,
  asPositiveSafeInteger,
  asSafeIntegerInRange,
  parseFiniteNumber,
  parseStrictFiniteNumber,
  parseStrictInteger,
  parseStrictNonNegativeInteger,
  parseStrictPositiveInteger,
} from "../shared/number-coercion.js";
/** Boolean parsing/coercion helpers for plugin config and tool inputs. */
export { asBoolean, parseBooleanValue } from "../utils/boolean.js";
/** Record guards and field readers for plugin boundary normalization. */
export {
  asRecord,
  asNullableRecord,
  asOptionalRecord,
  readStringField,
} from "../shared/record-coerce.js";
/** Low-level record guard used by existing SDK consumers. */
export { isRecord } from "../utils.js";
/** Stable string-list normalization helpers for plugin manifests and config. */
export {
  normalizeAtHashSlug,
  normalizeHyphenSlug,
  normalizeOptionalTrimmedStringList,
  normalizeSortedUniqueTrimmedStringList,
  normalizeSingleOrTrimmedStringList,
  normalizeStringEntries,
  normalizeStringEntriesLower,
  normalizeUniqueStringEntries,
  normalizeUniqueTrimmedStringList,
  normalizeTrimmedStringList,
  sortUniqueStrings,
  uniqueStrings,
  uniqueValues,
} from "../shared/string-normalization.js";
/** Compact string-list summary helper for diagnostics. */
export { summarizeStringEntries } from "../shared/string-sample.js";
