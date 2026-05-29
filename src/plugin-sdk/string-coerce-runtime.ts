// Narrow primitive coercion helpers for plugins that do not need the full text-runtime barrel.

/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk, starting with as Boolean. */
export { asBoolean, parseBooleanValue } from "../utils/boolean.js";
/** Re-exported API for src/plugin-sdk. */
export {
  asRecord,
  asNullableRecord,
  asOptionalRecord,
  readStringField,
} from "../shared/record-coerce.js";
/** Re-exported API for src/plugin-sdk, starting with is Record. */
export { isRecord } from "../utils.js";
/** Re-exported API for src/plugin-sdk. */
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
/** Re-exported API for src/plugin-sdk, starting with summarize String Entries. */
export { summarizeStringEntries } from "../shared/string-sample.js";
