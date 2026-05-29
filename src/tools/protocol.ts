// Projects planned tools into the compact descriptor shape sent to model adapters.
import type { JsonObject, ToolPlanEntry } from "./types.js";

/** Provider-facing descriptor subset used after planning and schema normalization. */
export type ToolProtocolDescriptor = {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: JsonObject;
};

// Shared descriptor shape only. Model/provider adapters still own schema normalization.
/** Converts a visible tool-plan entry into the model/provider protocol shape. */
export function toToolProtocolDescriptor(entry: ToolPlanEntry): ToolProtocolDescriptor {
  return {
    name: entry.descriptor.name,
    description: entry.descriptor.description,
    inputSchema: entry.descriptor.inputSchema,
  };
}

/** Converts all visible plan entries into provider-facing descriptors. */
export function toToolProtocolDescriptors(
  entries: readonly ToolPlanEntry[],
): readonly ToolProtocolDescriptor[] {
  return entries.map(toToolProtocolDescriptor);
}
