// config commands flags helpers and runtime behavior.
import { isPlainObject } from "../infra/plain-object.js";
import type { CommandsConfig } from "./types.js";

/** Shared type for Command Flag Key in src/config. */
export type CommandFlagKey = {
  [K in keyof CommandsConfig]-?: Exclude<CommandsConfig[K], undefined> extends boolean ? K : never;
}[keyof CommandsConfig];

function getOwnCommandFlagValue(
  config: { commands?: unknown } | undefined,
  key: CommandFlagKey,
): unknown {
  const { commands } = config ?? {};
  if (!isPlainObject(commands) || !Object.hasOwn(commands, key)) {
    return undefined;
  }
  return commands[key];
}

/** Reused helper for is Command Flag Enabled behavior in src/config. */
export function isCommandFlagEnabled(
  config: { commands?: unknown } | undefined,
  key: CommandFlagKey,
): boolean {
  return getOwnCommandFlagValue(config, key) === true;
}

/** Reused helper for is Restart Enabled behavior in src/config. */
export function isRestartEnabled(config?: { commands?: unknown }): boolean {
  return getOwnCommandFlagValue(config, "restart") !== false;
}
