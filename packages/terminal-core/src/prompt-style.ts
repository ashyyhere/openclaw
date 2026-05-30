// Prompt text styling helpers for Clack-based terminal prompts.
import { isRich, theme } from "./theme.js";

/** Style a prompt message with the terminal accent color when available. */
export const stylePromptMessage = (message: string): string =>
  isRich() ? theme.accent(message) : message;

/** Style an optional prompt title as a heading when rich output is available. */
export const stylePromptTitle = (title?: string): string | undefined =>
  title && isRich() ? theme.heading(title) : title;

/** Style an optional prompt hint as muted text when rich output is available. */
export const stylePromptHint = (hint?: string): string | undefined =>
  hint && isRich() ? theme.muted(hint) : hint;
