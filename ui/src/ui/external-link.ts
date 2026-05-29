// ui/src/ui external link helpers and runtime behavior.
import { normalizeOptionalLowercaseString } from "./string-coerce.ts";

const REQUIRED_EXTERNAL_REL_TOKENS = ["noopener", "noreferrer"] as const;

/** Reused constant for EXTERNAL LINK TARGET behavior in ui/src/ui. */
export const EXTERNAL_LINK_TARGET = "_blank";

/** Reused helper for build External Link Rel behavior in ui/src/ui. */
export function buildExternalLinkRel(currentRel?: string): string {
  const extraTokens: string[] = [];
  const seen = new Set<string>(REQUIRED_EXTERNAL_REL_TOKENS);

  for (const rawToken of (currentRel ?? "").split(/\s+/)) {
    const token = normalizeOptionalLowercaseString(rawToken);
    if (!token || seen.has(token)) {
      continue;
    }
    seen.add(token);
    extraTokens.push(token);
  }

  return [...REQUIRED_EXTERNAL_REL_TOKENS, ...extraTokens].join(" ");
}
