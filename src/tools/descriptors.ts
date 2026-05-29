// tools descriptors helpers and runtime behavior.
import type { ToolDescriptor } from "./types.js";

/** Reused helper for define Tool Descriptor behavior in src/tools. */
export function defineToolDescriptor(descriptor: ToolDescriptor): ToolDescriptor {
  return descriptor;
}

/** Reused helper for define Tool Descriptors behavior in src/tools. */
export function defineToolDescriptors(
  descriptors: readonly ToolDescriptor[],
): readonly ToolDescriptor[] {
  return descriptors;
}
