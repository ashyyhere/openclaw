// Inbound text normalization helpers.
/** Reused helper for normalize Inbound Text Newlines behavior in src/auto-reply/reply. */
export function normalizeInboundTextNewlines(input: string): string {
  // Normalize actual newline characters (CR+LF and CR to LF).
  // Do NOT replace literal backslash-n sequences (\\n) as they may be part of
  // Windows paths like C:\Work\nxxx\README.md or user-intended escape sequences.
  return input.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
}

/** Re-exported API for src/auto-reply/reply, starting with sanitize Inbound System Tags. */
export { sanitizeInboundSystemTags } from "../../security/system-tags.js";
