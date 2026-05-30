// Parser for CLI option tokens that may carry an inline `--flag=value` payload.
/** Parsed option token, preserving whether a value was supplied inline. */
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

/** Split one option token into its name and optional inline value. */
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
