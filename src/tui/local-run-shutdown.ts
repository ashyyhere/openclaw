// tui local run shutdown helpers and runtime behavior.
import { parseStrictNonNegativeInteger } from "../infra/parse-finite-number.js";

const LOCAL_RUN_SHUTDOWN_GRACE_MS = 120_000;

/** Reused helper for resolve Local Run Shutdown Grace Ms behavior in src/tui. */
export function resolveLocalRunShutdownGraceMs(): number {
  const raw = process.env.OPENCLAW_TUI_LOCAL_RUN_SHUTDOWN_GRACE_MS?.trim();
  const parsed = parseStrictNonNegativeInteger(raw);
  if (parsed !== undefined) {
    return parsed;
  }
  return LOCAL_RUN_SHUTDOWN_GRACE_MS;
}
