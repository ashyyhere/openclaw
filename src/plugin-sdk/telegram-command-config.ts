/**
 * @deprecated Public SDK subpath has no bundled extension production imports.
 * Use plugin-local Telegram command config handling for new plugin code.
 */

import {
  normalizeCommandDescription,
  normalizeSlashCommandName,
  resolveCustomCommands,
} from "../shared/custom-command-config.js";

/** Shared type for Telegram Custom Command Input in src/plugin-sdk. */
export type TelegramCustomCommandInput = {
  command?: string | null;
  description?: string | null;
};

/** Shared type for Telegram Custom Command Issue in src/plugin-sdk. */
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

/** Reused helper for get Telegram Command Name Pattern behavior in src/plugin-sdk. */
export function getTelegramCommandNamePattern(): RegExp {
  return TELEGRAM_COMMAND_NAME_PATTERN_VALUE;
}

/** Reused constant for TELEGRAM COMMAND NAME PATTERN behavior in src/plugin-sdk. */
export const TELEGRAM_COMMAND_NAME_PATTERN = TELEGRAM_COMMAND_NAME_PATTERN_VALUE;

/** Reused helper for normalize Telegram Command Name behavior in src/plugin-sdk. */
export function normalizeTelegramCommandName(value: string): string {
  return normalizeTelegramCommandNameImpl(value);
}

/** Reused helper for normalize Telegram Command Description behavior in src/plugin-sdk. */
export function normalizeTelegramCommandDescription(value: string): string {
  return normalizeTelegramCommandDescriptionImpl(value);
}

/** Reused helper for resolve Telegram Custom Commands behavior in src/plugin-sdk. */
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
