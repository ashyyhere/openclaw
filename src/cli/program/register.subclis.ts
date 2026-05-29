/** Registers optional sub-CLI groups according to startup policy. */
import type { Command } from "commander";
import { resolveCliArgvInvocation } from "../argv-invocation.js";
import {
  shouldEagerRegisterSubcommands,
  shouldRegisterPrimarySubcommandOnly,
} from "../command-registration-policy.js";
import {
  buildCommandGroupEntries,
  defineImportedProgramCommandGroupSpecs,
  type CommandGroupDescriptorSpec,
} from "./command-group-descriptors.js";
import {
  registerCommandGroupByName,
  registerCommandGroups,
  type CommandGroupEntry,
} from "./register-command-groups.js";
import {
  registerSubCliByName as registerSubCliByNameCore,
  registerSubCliCommands as registerSubCliCommandsCore,
  type SubCliRegistrationContext,
} from "./register.subclis-core.js";
import {
  getSubCliCommandsWithSubcommands,
  getSubCliEntries as getSubCliEntryDescriptors,
  type SubCliDescriptor,
} from "./subcli-descriptors.js";

/** Re-exported API for src/cli/program, starting with get Sub Cli Commands With Subcommands. */
export { getSubCliCommandsWithSubcommands };

type SubCliRegistrar = (
  program: Command,
  argv: string[],
  context: SubCliRegistrationContext,
) => Promise<void> | void;

const entrySpecs: readonly CommandGroupDescriptorSpec<SubCliRegistrar>[] = [
  ...defineImportedProgramCommandGroupSpecs([
    {
      commandNames: ["completion"],
      loadModule: () => import("../completion-cli.js"),
      exportName: "registerCompletionCli",
    },
  ]),
];

function resolveSubCliCommandGroups(
  argv: string[],
  context: SubCliRegistrationContext = {},
): CommandGroupEntry[] {
  return buildCommandGroupEntries(
    getSubCliEntryDescriptors(),
    entrySpecs,
    (register) => async (program) => {
      await register(program, argv, context);
    },
  );
}

/** Reused helper for get Sub Cli Entries behavior in src/cli/program. */
export function getSubCliEntries(): ReadonlyArray<SubCliDescriptor> {
  return getSubCliEntryDescriptors();
}

/** Reused helper for register Sub Cli By Name behavior in src/cli/program. */
export async function registerSubCliByName(
  program: Command,
  name: string,
  argv: string[] = process.argv,
  context: SubCliRegistrationContext = {},
): Promise<boolean> {
  if (await registerSubCliByNameCore(program, name, argv, context)) {
    return true;
  }
  return registerCommandGroupByName(program, resolveSubCliCommandGroups(argv, context), name);
}

/** Reused helper for register Sub Cli Commands behavior in src/cli/program. */
export function registerSubCliCommands(program: Command, argv: string[] = process.argv) {
  registerSubCliCommandsCore(program, argv);
  const { primary } = resolveCliArgvInvocation(argv);
  registerCommandGroups(program, resolveSubCliCommandGroups(argv), {
    eager: shouldEagerRegisterSubcommands(),
    primary,
    registerPrimaryOnly: Boolean(primary && shouldRegisterPrimarySubcommandOnly(argv)),
  });
}
