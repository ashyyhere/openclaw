// shared regexp helpers and runtime behavior.
/** Reused helper for escape Reg Exp behavior in src/shared. */
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
