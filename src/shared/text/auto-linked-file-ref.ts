// shared/text auto linked file ref helpers and runtime behavior.
import { normalizeLowercaseStringOrEmpty } from "../string-coerce.js";

const FILE_REF_EXTENSIONS = ["md", "go", "py", "pl", "sh", "am", "at", "be", "cc"] as const;

/** Reused constant for FILE REF EXTENSIONS WITH TLD behavior in src/shared/text. */
export const FILE_REF_EXTENSIONS_WITH_TLD = new Set<string>(FILE_REF_EXTENSIONS);

/** Reused helper for is Auto Linked File Ref behavior in src/shared/text. */
export function isAutoLinkedFileRef(href: string, label: string): boolean {
  const stripped = href.replace(/^https?:\/\//i, "");
  if (stripped !== label) {
    return false;
  }
  const dotIndex = label.lastIndexOf(".");
  if (dotIndex < 1) {
    return false;
  }
  const ext = normalizeLowercaseStringOrEmpty(label.slice(dotIndex + 1));
  if (!FILE_REF_EXTENSIONS_WITH_TLD.has(ext)) {
    return false;
  }
  const segments = label.split("/");
  if (segments.length > 1) {
    for (let i = 0; i < segments.length - 1; i += 1) {
      if (segments[i]?.includes(".")) {
        return false;
      }
    }
  }
  return true;
}
