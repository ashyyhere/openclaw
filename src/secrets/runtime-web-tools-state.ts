// secrets runtime web tools state helpers and runtime behavior.
import type { RuntimeWebToolsMetadata } from "./runtime-web-tools.types.js";

let activeRuntimeWebToolsMetadata: RuntimeWebToolsMetadata | null = null;

/** Reused helper for clear Active Runtime Web Tools Metadata behavior in src/secrets. */
export function clearActiveRuntimeWebToolsMetadata(): void {
  activeRuntimeWebToolsMetadata = null;
}

/** Reused helper for set Active Runtime Web Tools Metadata behavior in src/secrets. */
export function setActiveRuntimeWebToolsMetadata(metadata: RuntimeWebToolsMetadata): void {
  activeRuntimeWebToolsMetadata = structuredClone(metadata);
}

/** Reused helper for get Active Runtime Web Tools Metadata behavior in src/secrets. */
export function getActiveRuntimeWebToolsMetadata(): RuntimeWebToolsMetadata | null {
  if (!activeRuntimeWebToolsMetadata) {
    return null;
  }
  return structuredClone(activeRuntimeWebToolsMetadata);
}
