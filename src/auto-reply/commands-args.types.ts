// Shared value shapes for parsed chat command arguments.
/** Shared type for Command Arg Value in src/auto-reply. */
export type CommandArgValue = string | number | boolean | bigint;
/** Shared type for Command Arg Values in src/auto-reply. */
export type CommandArgValues = Record<string, CommandArgValue>;

/** Shared type for Command Args in src/auto-reply. */
export type CommandArgs = {
  raw?: string;
  values?: CommandArgValues;
};
