// tts tts auto mode helpers and runtime behavior.
import type { TtsAutoMode } from "../config/types.tts.js";
import { normalizeOptionalLowercaseString } from "../shared/string-coerce.js";

/** Reused constant for TTS AUTO MODES behavior in src/tts. */
export const TTS_AUTO_MODES = new Set<TtsAutoMode>(["off", "always", "inbound", "tagged"]);

/** Reused helper for normalize Tts Auto Mode behavior in src/tts. */
export function normalizeTtsAutoMode(value: unknown): TtsAutoMode | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = normalizeOptionalLowercaseString(value);
  if (TTS_AUTO_MODES.has(normalized as TtsAutoMode)) {
    return normalized as TtsAutoMode;
  }
  return undefined;
}
