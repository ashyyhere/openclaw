// gateway openresponses file content helpers and runtime behavior.
import { wrapExternalContent } from "../security/external-content.js";

/** Reused helper for wrap Untrusted File Content behavior in src/gateway. */
export function wrapUntrustedFileContent(content: string): string {
  return wrapExternalContent(content, {
    source: "unknown",
    includeWarning: false,
  });
}
