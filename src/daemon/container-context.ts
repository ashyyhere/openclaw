// daemon container context helpers and runtime behavior.
import { normalizeOptionalString } from "../shared/string-coerce.js";

/** Reused helper for resolve Daemon Container Context behavior in src/daemon. */
export function resolveDaemonContainerContext(
  env: Record<string, string | undefined> = process.env,
): string | null {
  return (
    normalizeOptionalString(env.OPENCLAW_CONTAINER_HINT) ||
    normalizeOptionalString(env.OPENCLAW_CONTAINER) ||
    null
  );
}
