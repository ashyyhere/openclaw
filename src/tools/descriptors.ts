// Identity helpers that let callers declare descriptor objects with tool contract types.
import type { ToolDescriptor } from "./types.js";

/** Returns a descriptor unchanged while preserving `ToolDescriptor` type checking. */
export function defineToolDescriptor(descriptor: ToolDescriptor): ToolDescriptor {
  return descriptor;
}

/** Returns a descriptor list unchanged while preserving readonly descriptor typing. */
export function defineToolDescriptors(
  descriptors: readonly ToolDescriptor[],
): readonly ToolDescriptor[] {
  return descriptors;
}
