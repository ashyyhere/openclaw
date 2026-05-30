import type { Command } from "commander";
import {
  getCoreCliCommandDescriptors,
  getCoreCliCommandNames,
  getCoreCliCommandsWithSubcommands,
  type CommandRegistration,
  registerCoreCliByName,
  registerCoreCliCommands,
} from "./command-registry-core.js";
import type { ProgramContext } from "./context.js";
import { registerSubCliCommands } from "./register.subclis.js";

/**
 * Re-export core command registry APIs used by eager and lazy CLI registration.
 */
export {
  getCoreCliCommandDescriptors,
  getCoreCliCommandNames,
  getCoreCliCommandsWithSubcommands,
  registerCoreCliByName,
  registerCoreCliCommands,
};
/** Core command descriptor shape used by the program registry. */
export type { CommandRegistration };

/** Register built-in commands first, then attach external sub-CLI entrypoints. */
export function registerProgramCommands(
  program: Command,
  ctx: ProgramContext,
  argv: string[] = process.argv,
) {
  registerCoreCliCommands(program, ctx, argv);
  registerSubCliCommands(program, argv);
}
