// Inline reply whitespace normalization helpers.
const INLINE_HORIZONTAL_WHITESPACE_RE = /[^\S\n]+/g;

/** Reused helper for collapse Inline Horizontal Whitespace behavior in src/auto-reply/reply. */
export function collapseInlineHorizontalWhitespace(value: string): string {
  return value.replace(INLINE_HORIZONTAL_WHITESPACE_RE, " ");
}
