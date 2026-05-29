// Lazy runtime boundary for status message code used by lighter status imports.
/** Loads the heavier auto-reply status runtime module on demand. */
export async function loadStatusMessageRuntimeModule() {
  return await import("../auto-reply/status.runtime.js");
}
