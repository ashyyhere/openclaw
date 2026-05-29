/** Utilities for removing commands from Commander command trees. */
import type { Command } from "commander";

/** Reused helper for remove Command behavior in src/cli/program. */
export function removeCommand(program: Command, command: Command): boolean {
  const commands = program.commands as Command[];
  const index = commands.indexOf(command);
  if (index < 0) {
    return false;
  }
  commands.splice(index, 1);
  return true;
}

/** Reused helper for remove Command By Name behavior in src/cli/program. */
export function removeCommandByName(program: Command, name: string): boolean {
  const existing = program.commands.find(
    (command) => command.name() === name || command.aliases().includes(name),
  );
  if (!existing) {
    return false;
  }
  return removeCommand(program, existing);
}
