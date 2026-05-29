// terminal prompt style helpers and runtime behavior.
import { isRich, theme } from "./theme.js";

/** Reused constant for style Prompt Message behavior in src/terminal. */
export const stylePromptMessage = (message: string): string =>
  isRich() ? theme.accent(message) : message;

/** Reused constant for style Prompt Title behavior in src/terminal. */
export const stylePromptTitle = (title?: string): string | undefined =>
  title && isRich() ? theme.heading(title) : title;

/** Reused constant for style Prompt Hint behavior in src/terminal. */
export const stylePromptHint = (hint?: string): string | undefined =>
  hint && isRich() ? theme.muted(hint) : hint;
