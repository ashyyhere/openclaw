// infra inline option token helpers and runtime behavior.
/** Shared type for Inline Option Token in src/infra. */
export type InlineOptionToken =
  | {
      name: string;
      hasInlineValue: false;
    }
  | {
      name: string;
      hasInlineValue: true;
      inlineValue: string;
    };

/** Reused helper for parse Inline Option Token behavior in src/infra. */
export function parseInlineOptionToken(token: string): InlineOptionToken {
  const separatorIndex = token.indexOf("=");
  if (separatorIndex < 0) {
    return { name: token, hasInlineValue: false };
  }
  return {
    name: token.slice(0, separatorIndex),
    hasInlineValue: true,
    inlineValue: token.slice(separatorIndex + 1),
  };
}
