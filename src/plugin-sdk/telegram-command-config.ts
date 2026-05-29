/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Use plugin-local Telegram command config handling for new plugin code.
 */

import {
  normalizeCommandDescription,
  normalizeSlashCommandName,
  resolveCustomCommands,
} from "../shared/custom-command-config.js";

/** Raw custom command entry accepted by the deprecated Telegram SDK bridge. */
export type TelegramCustomCommandInput = {
  command?: string | null;
  description?: string | null;
};

/** Validation issue returned with the original command index for UI diagnostics. */
export type TelegramCustomCommandIssue = {
  index: number;
  field: "command" | "description";
  message: string;
};
const TELEGRAM_COMMAND_NAME_PATTERN_VALUE = /^[a-z0-9_]{1,32}$/;
const TELEGRAM_CUSTOM_COMMAND_CONFIG = {
  label: "Telegram",
  pattern: TELEGRAM_COMMAND_NAME_PATTERN_VALUE,
  patternDescription: "use a-z, 0-9, underscore; max 32 chars",
} as const;

function normalizeTelegramCommandNameImpl(value: string): string {
  return normalizeSlashCommandName(value);
}

function normalizeTelegramCommandDescriptionImpl(value: string): string {
  return normalizeCommandDescription(value);
}

function resolveTelegramCustomCommandsImpl(params: {
  commands?: TelegramCustomCommandInput[] | null;
  reservedCommands?: Set<string>;
  checkReserved?: boolean;
  checkDuplicates?: boolean;
}): {
  commands: Array<{ command: string; description: string }>;
  issues: TelegramCustomCommandIssue[];
} {
  return resolveCustomCommands({
    ...params,
    config: TELEGRAM_CUSTOM_COMMAND_CONFIG,
  });
}

/** Return the Telegram slash-command name contract without exposing a mutable regex. */
export function getTelegramCommandNamePattern(): RegExp {
  return TELEGRAM_COMMAND_NAME_PATTERN_VALUE;
}

/** Telegram slash-command name contract: lowercase letters, digits, and underscore. */
export const TELEGRAM_COMMAND_NAME_PATTERN = TELEGRAM_COMMAND_NAME_PATTERN_VALUE;

/** Normalize a Telegram command name before validation and duplicate checks. */
export function normalizeTelegramCommandName(value: string): string {
  return normalizeTelegramCommandNameImpl(value);
}

/** Normalize Telegram command descriptions before manifest/config comparison. */
export function normalizeTelegramCommandDescription(value: string): string {
  return normalizeTelegramCommandDescriptionImpl(value);
}

/** Normalize and validate Telegram custom commands with optional reserved/duplicate checks. */
export function resolveTelegramCustomCommands(params: {
  commands?: TelegramCustomCommandInput[] | null;
  reservedCommands?: Set<string>;
  checkReserved?: boolean;
  checkDuplicates?: boolean;
}): {
  commands: Array<{ command: string; description: string }>;
  issues: TelegramCustomCommandIssue[];
} {
  return resolveTelegramCustomCommandsImpl(params);
}
