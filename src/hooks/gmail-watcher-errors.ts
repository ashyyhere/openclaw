// hooks gmail watcher errors helpers and runtime behavior.
const ADDRESS_IN_USE_RE = /address already in use|EADDRINUSE/i;

/** Reused helper for is Address In Use Error behavior in src/hooks. */
export function isAddressInUseError(line: string): boolean {
  return ADDRESS_IN_USE_RE.test(line);
}
