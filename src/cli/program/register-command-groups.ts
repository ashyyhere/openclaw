/** Registers grouped command descriptors onto the root program. */
import type { Command } from "commander";
import { uniqueStrings } from "../../shared/string-normalization.js";
import { removeCommandByName } from "./command-tree.js";
import { registerLazyCommand } from "./register-lazy-command.js";

/** Lightweight command stub registered before its full command group is loaded. */
export type CommandGroupPlaceholder = {
  name: string;
  description: string;
  options?: readonly CommandGroupPlaceholderOption[];
};

/** Option metadata shown on a lazy command placeholder. */
export type CommandGroupPlaceholderOption = {
  flags: string;
  description: string;
};

/** Lazily-loadable command group with one or more command names. */
export type CommandGroupEntry = {
  placeholders: readonly CommandGroupPlaceholder[];
  names?: readonly string[];
  register: (program: Command) => Promise<void> | void;
};

/** Return all command names claimed by a command group. */
export function getCommandGroupNames(entry: CommandGroupEntry): readonly string[] {
  return entry.names ?? entry.placeholders.map((placeholder) => placeholder.name);
}

/** Find the command group that owns a command name. */
export function findCommandGroupEntry(
  entries: readonly CommandGroupEntry[],
  name: string,
): CommandGroupEntry | undefined {
  return entries.find((entry) => getCommandGroupNames(entry).includes(name));
}

/** Remove all placeholders/commands owned by a command group. */
export function removeCommandGroupNames(program: Command, entry: CommandGroupEntry) {
  for (const name of new Set(getCommandGroupNames(entry))) {
    removeCommandByName(program, name);
  }
}

/** Eagerly register the command group that owns a command name. */
export async function registerCommandGroupByName(
  program: Command,
  entries: readonly CommandGroupEntry[],
  name: string,
): Promise<boolean> {
  const entry = findCommandGroupEntry(entries, name);
  if (!entry) {
    return false;
  }
  removeCommandGroupNames(program, entry);
  await entry.register(program);
  return true;
}

/** Register one lazy placeholder that expands into its full command group. */
export function registerLazyCommandGroup(
  program: Command,
  entry: CommandGroupEntry,
  placeholder: CommandGroupPlaceholder,
) {
  registerLazyCommand({
    program,
    name: placeholder.name,
    description: placeholder.description,
    options: placeholder.options,
    removeNames: uniqueStrings(getCommandGroupNames(entry)),
    register: async () => {
      await entry.register(program);
    },
  });
}

/** Register command groups eagerly or as lazy placeholders based on startup policy. */
export function registerCommandGroups(
  program: Command,
  entries: readonly CommandGroupEntry[],
  params: {
    eager: boolean;
    primary: string | null;
    registerPrimaryOnly: boolean;
  },
) {
  if (params.eager) {
    for (const entry of entries) {
      void entry.register(program);
    }
    return;
  }

  if (params.primary && params.registerPrimaryOnly) {
    const entry = findCommandGroupEntry(entries, params.primary);
    if (entry) {
      const placeholder = entry.placeholders.find((candidate) => candidate.name === params.primary);
      if (placeholder) {
        registerLazyCommandGroup(program, entry, placeholder);
      }
      return;
    }
  }

  for (const entry of entries) {
    for (const placeholder of entry.placeholders) {
      registerLazyCommandGroup(program, entry, placeholder);
    }
  }
}
