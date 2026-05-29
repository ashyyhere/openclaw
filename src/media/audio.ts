// media audio helpers and runtime behavior.
import { normalizeOptionalString } from "../shared/string-coerce.js";
import { getFileExtension, normalizeMimeType } from "./mime.js";

/** Reused constant for VOICE MESSAGE AUDIO EXTENSIONS behavior in src/media. */
export const VOICE_MESSAGE_AUDIO_EXTENSIONS = new Set([".oga", ".ogg", ".opus", ".mp3", ".m4a"]);

/**
 * MIME types compatible with voice messages.
 */
export const VOICE_MESSAGE_MIME_TYPES = new Set([
  "audio/ogg",
  "audio/opus",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
]);

/** Reused helper for is Voice Message Compatible Audio behavior in src/media. */
export function isVoiceMessageCompatibleAudio(opts: {
  contentType?: string | null;
  fileName?: string | null;
}): boolean {
  const mime = normalizeMimeType(opts.contentType);
  if (mime && VOICE_MESSAGE_MIME_TYPES.has(mime)) {
    return true;
  }
  const fileName = normalizeOptionalString(opts.fileName);
  if (!fileName) {
    return false;
  }
  const ext = getFileExtension(fileName);
  if (!ext) {
    return false;
  }
  return VOICE_MESSAGE_AUDIO_EXTENSIONS.has(ext);
}

/** Reused helper for is Voice Compatible Audio behavior in src/media. */
export function isVoiceCompatibleAudio(opts: {
  contentType?: string | null;
  fileName?: string | null;
}): boolean {
  return isVoiceMessageCompatibleAudio(opts);
}
