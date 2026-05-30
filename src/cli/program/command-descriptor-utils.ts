/** Helpers for adding descriptor-backed commands to Commander programs. */
import type { Command } from "commander";
import { sanitizeForLog } from "../../../packages/terminal-core/src/ansi.js";
import type { NamedCommandDescriptor } from "./command-group-descriptors.js";

/** Minimal command descriptor shape needed to register placeholder commands. */
export type CommandDescriptorLike = Pick<NamedCommandDescriptor, "name" | "description">;

const SAFE_COMMAND_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

/** Descriptor catalog facade used by CLI groups and tests. */
export type CommandDescriptorCatalog<TDescriptor extends NamedCommandDescriptor> = {
  descriptors: readonly TDescriptor[];
  getDescriptors: () => readonly TDescriptor[];
  getNames: () => string[];
  getCommandsWithSubcommands: () => string[];
  getParentDefaultHelpCommands: () => string[];
};

/** Validates and trims a command descriptor name before Commander registration. */
export function normalizeCommandDescriptorName(name: string): string | null {
  const normalized = name.trim();
  return SAFE_COMMAND_NAME_PATTERN.test(normalized) ? normalized : null;
}

function assertSafeCommandDescriptorName(name: string): string {
  const normalized = normalizeCommandDescriptorName(name);
  if (!normalized) {
    throw new Error(`Invalid CLI command name: ${JSON.stringify(name.trim())}`);
  }
  return normalized;
}

/** Removes terminal control characters from command descriptions. */
export function sanitizeCommandDescriptorDescription(description: string): string {
  return sanitizeForLog(description).trim();
}

/** Returns descriptor names in registration order. */
export function getCommandDescriptorNames(descriptors: readonly CommandDescriptorLike[]): string[] {
  return descriptors.map((descriptor) => descriptor.name);
}

/** Returns descriptor names whose real command implementations own subcommands. */
export function getCommandsWithSubcommands(
  descriptors: readonly NamedCommandDescriptor[],
): string[] {
  return descriptors
    .filter((descriptor) => descriptor.hasSubcommands)
    .map((descriptor) => descriptor.name);
}

/** Returns parent commands that should show help when invoked without subcommands. */
export function getParentDefaultHelpCommands(
  descriptors: readonly NamedCommandDescriptor[],
): string[] {
  return descriptors
    .filter((descriptor) => descriptor.parentDefaultHelp)
    .map((descriptor) => descriptor.name);
}

/** Deduplicates descriptor groups while preserving first-seen command order. */
export function collectUniqueCommandDescriptors<TDescriptor extends CommandDescriptorLike>(
  descriptorGroups: readonly (readonly TDescriptor[])[],
): TDescriptor[] {
  const seen = new Set<string>();
  const descriptors: TDescriptor[] = [];
  for (const group of descriptorGroups) {
    for (const descriptor of group) {
      if (seen.has(descriptor.name)) {
        continue;
      }
      seen.add(descriptor.name);
      descriptors.push(descriptor);
    }
  }
  return descriptors;
}

/** Builds the command descriptor catalog helper object from static descriptors. */
export function defineCommandDescriptorCatalog<TDescriptor extends NamedCommandDescriptor>(
  descriptors: readonly TDescriptor[],
): CommandDescriptorCatalog<TDescriptor> {
  return {
    descriptors,
    getDescriptors: () => descriptors,
    getNames: () => getCommandDescriptorNames(descriptors),
    getCommandsWithSubcommands: () => getCommandsWithSubcommands(descriptors),
    getParentDefaultHelpCommands: () => getParentDefaultHelpCommands(descriptors),
  };
}

/** Registers safe descriptor-backed placeholder commands on a Commander program. */
export function addCommandDescriptorsToProgram(
  program: Command,
  descriptors: readonly CommandDescriptorLike[],
  existingCommands: Set<string> = new Set(),
): Set<string> {
  for (const descriptor of descriptors) {
    const name = assertSafeCommandDescriptorName(descriptor.name);
    if (existingCommands.has(name)) {
      continue;
    }
    program.command(name).description(sanitizeCommandDescriptorDescription(descriptor.description));
    existingCommands.add(name);
  }
  return existingCommands;
}
