// tools protocol helpers and runtime behavior.
import type { JsonObject, ToolPlanEntry } from "./types.js";

/** Shared type for Tool Protocol Descriptor in src/tools. */
export type ToolProtocolDescriptor = {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: JsonObject;
};

// Shared descriptor shape only. Model/provider adapters still own schema normalization.
/** Reused helper for to Tool Protocol Descriptor behavior in src/tools. */
export function toToolProtocolDescriptor(entry: ToolPlanEntry): ToolProtocolDescriptor {
  return {
    name: entry.descriptor.name,
    description: entry.descriptor.description,
    inputSchema: entry.descriptor.inputSchema,
  };
}

/** Reused helper for to Tool Protocol Descriptors behavior in src/tools. */
export function toToolProtocolDescriptors(
  entries: readonly ToolPlanEntry[],
): readonly ToolProtocolDescriptor[] {
  return entries.map(toToolProtocolDescriptor);
}
