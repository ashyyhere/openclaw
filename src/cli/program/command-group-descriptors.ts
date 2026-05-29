/** Types and builders for grouped CLI command descriptor catalogs. */
import type { Command } from "commander";

/** Shared type for Named Command Descriptor in src/cli/program. */
export type NamedCommandDescriptor = {
  name: string;
  description: string;
  hasSubcommands: boolean;
  parentDefaultHelp?: boolean;
};

/** Shared type for Command Group Descriptor Spec in src/cli/program. */
export type CommandGroupDescriptorSpec<TRegister> = {
  commandNames: readonly string[];
  register: TRegister;
};

/** Shared type for Imported Command Group Definition in src/cli/program. */
export type ImportedCommandGroupDefinition<TRegisterArgs, TModule> = {
  commandNames: readonly string[];
  loadModule: () => Promise<TModule>;
  register: (module: TModule, args: TRegisterArgs) => Promise<void> | void;
};

/** Shared type for Resolved Command Group Entry in src/cli/program. */
export type ResolvedCommandGroupEntry<TDescriptor extends NamedCommandDescriptor, TRegister> = {
  placeholders: TDescriptor[];
  register: TRegister;
};

type CommandGroupEntryLike = {
  placeholders: NamedCommandDescriptor[];
  register: (program: Command) => Promise<void> | void;
};

function buildDescriptorIndex<TDescriptor extends NamedCommandDescriptor>(
  descriptors: readonly TDescriptor[],
): Map<string, TDescriptor> {
  return new Map(descriptors.map((descriptor) => [descriptor.name, descriptor]));
}

/** Reused helper for resolve Command Group Entries behavior in src/cli/program. */
export function resolveCommandGroupEntries<TDescriptor extends NamedCommandDescriptor, TRegister>(
  descriptors: readonly TDescriptor[],
  specs: readonly CommandGroupDescriptorSpec<TRegister>[],
): ResolvedCommandGroupEntry<TDescriptor, TRegister>[] {
  const descriptorsByName = buildDescriptorIndex(descriptors);
  return specs.map((spec) => ({
    placeholders: spec.commandNames.map((name) => {
      const descriptor = descriptorsByName.get(name);
      if (!descriptor) {
        throw new Error(`Unknown command descriptor: ${name}`);
      }
      return descriptor;
    }),
    register: spec.register,
  }));
}

/** Reused helper for build Command Group Entries behavior in src/cli/program. */
export function buildCommandGroupEntries<TRegister>(
  descriptors: readonly NamedCommandDescriptor[],
  specs: readonly CommandGroupDescriptorSpec<TRegister>[],
  mapRegister: (register: TRegister) => CommandGroupEntryLike["register"],
): CommandGroupEntryLike[] {
  return resolveCommandGroupEntries(descriptors, specs).map((entry) => ({
    placeholders: entry.placeholders,
    register: mapRegister(entry.register),
  }));
}

/** Reused helper for define Imported Command Group Spec behavior in src/cli/program. */
export function defineImportedCommandGroupSpec<TRegisterArgs, TModule>(
  commandNames: readonly string[],
  loadModule: () => Promise<TModule>,
  register: (module: TModule, args: TRegisterArgs) => Promise<void> | void,
): CommandGroupDescriptorSpec<(args: TRegisterArgs) => Promise<void>> {
  return {
    commandNames,
    register: async (args: TRegisterArgs) => {
      const module = await loadModule();
      await register(module, args);
    },
  };
}

/** Reused helper for define Imported Command Group Specs behavior in src/cli/program. */
export function defineImportedCommandGroupSpecs<TRegisterArgs, TModule>(
  definitions: readonly ImportedCommandGroupDefinition<TRegisterArgs, TModule>[],
): CommandGroupDescriptorSpec<(args: TRegisterArgs) => Promise<void>>[] {
  return definitions.map((definition) =>
    defineImportedCommandGroupSpec(
      definition.commandNames,
      definition.loadModule,
      definition.register,
    ),
  );
}

type ProgramCommandRegistrar = (program: Command) => Promise<void> | void;
type AnyImportedProgramCommandGroupDefinition = {
  commandNames: readonly string[];
  loadModule: () => Promise<Record<string, unknown>>;
  exportName: string;
};

/** Shared type for Imported Program Command Group Definition in src/cli/program. */
export type ImportedProgramCommandGroupDefinition<
  TModule extends Record<TKey, ProgramCommandRegistrar>,
  TKey extends keyof TModule & string,
> = {
  commandNames: readonly string[];
  loadModule: () => Promise<TModule>;
  exportName: TKey;
};

/** Reused helper for define Imported Program Command Group Spec behavior in src/cli/program. */
export function defineImportedProgramCommandGroupSpec<
  TModule extends Record<TKey, ProgramCommandRegistrar>,
  TKey extends keyof TModule & string,
>(
  definition: ImportedProgramCommandGroupDefinition<TModule, TKey>,
): CommandGroupDescriptorSpec<(program: Command) => Promise<void>> {
  return defineImportedCommandGroupSpec(
    definition.commandNames,
    definition.loadModule,
    (module, program: Command) => module[definition.exportName](program),
  );
}

/** Reused helper for define Imported Program Command Group Specs behavior in src/cli/program. */
export function defineImportedProgramCommandGroupSpecs(
  definitions: readonly AnyImportedProgramCommandGroupDefinition[],
): CommandGroupDescriptorSpec<(program: Command) => Promise<void>>[] {
  return definitions.map((definition) => ({
    commandNames: definition.commandNames,
    register: async (program: Command) => {
      const module = await definition.loadModule();
      const register = module[definition.exportName];
      if (typeof register !== "function") {
        throw new Error(`Missing program command registrar: ${definition.exportName}`);
      }
      await register(program);
    },
  }));
}
