// plugin-sdk/test-helpers string utils helpers and runtime behavior.
import { sortUniqueStrings } from "../../shared/string-normalization.js";

export function uniqueSortedStrings(values: readonly string[]) {
  return sortUniqueStrings(values);
}
