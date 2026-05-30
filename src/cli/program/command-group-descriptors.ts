/** Types and builders for grouped CLI command descriptor catalogs. */
import type { Command } from "commander";

/** CLI command placeholder metadata shown before a lazy command group loads. */
export type NamedCommandDescriptor = {
  name: string;
  description: string;
  hasSubcommands: boolean;
  parentDefaultHelp?: boolean;
};

/** Command names and registrar for one lazy or eager CLI command group. */
export type CommandGroupDescriptorSpec<TRegister> = {
  commandNames: readonly string[];
  register: TRegister;
};

/** Dynamic-import definition for a command group whose module loads on demand. */
export type ImportedCommandGroupDefinition<TRegisterArgs, TModule> = {
  commandNames: readonly string[];
  loadModule: () => Promise<TModule>;
  register: (module: TModule, args: TRegisterArgs) => Promise<void> | void;
};

/** Descriptor placeholders paired with the registrar that installs their real commands. */
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

/** Resolves command group specs to descriptors and fails on unknown command names. */
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

/** Builds commander-ready command group entries from descriptor specs. */
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

/** Defines a lazy command group spec backed by a dynamic module import. */
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

/** Maps multiple dynamic import definitions into lazy command group specs. */
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

/** Dynamic-import definition for a program registrar exported by name. */
export type ImportedProgramCommandGroupDefinition<
  TModule extends Record<TKey, ProgramCommandRegistrar>,
  TKey extends keyof TModule & string,
> = {
  commandNames: readonly string[];
  loadModule: () => Promise<TModule>;
  exportName: TKey;
};

/** Defines a lazy program command group from a named registrar export. */
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

/** Maps named registrar definitions into lazy program command group specs. */
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
