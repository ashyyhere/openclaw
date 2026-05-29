// Runtime boundary for status status message runtime behavior.
/** Reused helper for load Status Message Runtime Module behavior in src/status. */
export async function loadStatusMessageRuntimeModule() {
  return await import("../auto-reply/status.runtime.js");
}
