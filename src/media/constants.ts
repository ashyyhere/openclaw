// Shared media size ceilings used before loading or generating attachment
// buffers. Keep these defaults conservative for provider and channel limits.
/** Default maximum image attachment size in bytes. */
export const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6MB
/** Default maximum audio attachment size in bytes. */
export const MAX_AUDIO_BYTES = 16 * 1024 * 1024; // 16MB
/** Default maximum video attachment size in bytes. */
export const MAX_VIDEO_BYTES = 16 * 1024 * 1024; // 16MB
/** Default maximum document attachment size in bytes. */
export const MAX_DOCUMENT_BYTES = 100 * 1024 * 1024; // 100MB

/** Media bucket used to choose attachment size limits and channel handling. */
export type MediaKind = "image" | "audio" | "video" | "document";

/** Map a normalized MIME type to the broad media kind OpenClaw routes on. */
export function mediaKindFromMime(mime?: string | null): MediaKind | undefined {
  if (!mime) {
    return undefined;
  }
  if (mime.startsWith("image/")) {
    return "image";
  }
  if (mime.startsWith("audio/")) {
    return "audio";
  }
  if (mime.startsWith("video/")) {
    return "video";
  }
  if (mime === "application/pdf") {
    return "document";
  }
  if (mime.startsWith("text/")) {
    return "document";
  }
  if (mime.startsWith("application/")) {
    return "document";
  }
  return undefined;
}

/** Return the default byte ceiling for a broad media kind. */
export function maxBytesForKind(kind: MediaKind): number {
  switch (kind) {
    case "image":
      return MAX_IMAGE_BYTES;
    case "audio":
      return MAX_AUDIO_BYTES;
    case "video":
      return MAX_VIDEO_BYTES;
    case "document":
      return MAX_DOCUMENT_BYTES;
    default:
      return MAX_DOCUMENT_BYTES;
  }
}
