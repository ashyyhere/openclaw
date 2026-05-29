// Runtime boundary for config/sessions main session runtime behavior.
import { getRuntimeConfig } from "../io.js";
import { resolveMainSessionKey } from "./main-session.js";

/** Reused helper for resolve Main Session Key From Config behavior in src/config/sessions. */
export function resolveMainSessionKeyFromConfig(): string {
  return resolveMainSessionKey(getRuntimeConfig());
}
