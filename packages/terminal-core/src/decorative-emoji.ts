// Decorative emoji helpers that degrade cleanly on limited terminals.
import { splitGraphemes } from "./ansi.js";

/** Terminal and locale inputs used to decide whether decorative emoji are safe. */
export type DecorativeEmojiOptions = {
  env?: NodeJS.ProcessEnv;
  isTty?: boolean;
  platform?: NodeJS.Platform;
  stream?: { isTTY?: boolean };
};

const EMOJI_GRAPHEME_PATTERN = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u20e3]/u;

function isKnownEmojiTerminal(env: NodeJS.ProcessEnv): boolean {
  const termProgram = (env.TERM_PROGRAM ?? "").toLowerCase();
  const term = (env.TERM ?? "").toLowerCase();
  return (
    termProgram.includes("iterm") ||
    termProgram.includes("apple_terminal") ||
    termProgram.includes("ghostty") ||
    termProgram.includes("wezterm") ||
    termProgram.includes("vscode") ||
    term.includes("ghostty") ||
    term.includes("wezterm") ||
    Boolean(env.WT_SESSION)
  );
}

function hasUtf8Locale(env: NodeJS.ProcessEnv): boolean {
  const locale = [env.LC_ALL, env.LC_CTYPE, env.LANG].find(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
  if (!locale) {
    return true;
  }
  return /utf-?8/i.test(locale);
}

/** Return whether the current terminal is likely to render decorative emoji correctly. */
export function supportsDecorativeEmoji(options: DecorativeEmojiOptions = {}): boolean {
  const env = options.env ?? process.env;
  const platform = options.platform ?? process.platform;
  const isTty = options.isTty ?? options.stream?.isTTY ?? process.stdout.isTTY;

  if (!isTty) {
    return false;
  }
  if ((env.TERM ?? "").toLowerCase() === "dumb") {
    return false;
  }
  if (!hasUtf8Locale(env)) {
    return false;
  }
  if (isKnownEmojiTerminal(env)) {
    return true;
  }
  if (platform === "darwin") {
    return true;
  }
  return false;
}

/** Return an emoji only when decorative emoji are supported. */
export function decorativeEmoji(emoji: string, options: DecorativeEmojiOptions = {}): string {
  return supportsDecorativeEmoji(options) ? emoji : "";
}

/** Prefix text with an emoji when the terminal can render it. */
export function decorativePrefix(
  emoji: string,
  text: string,
  options: DecorativeEmojiOptions = {},
): string {
  const prefix = decorativeEmoji(emoji, options);
  return prefix ? `${prefix} ${text}` : text;
}

/** Remove decorative emoji when terminal output should stay plain-text safe. */
export function stripDecorativeEmojiForTerminal(
  text: string,
  options: DecorativeEmojiOptions = {},
): string {
  if (supportsDecorativeEmoji(options)) {
    return text;
  }
  return splitGraphemes(text)
    .filter((grapheme) => !EMOJI_GRAPHEME_PATTERN.test(grapheme))
    .join("")
    .replace(/\s{2,}/g, " ")
    .trim();
}
