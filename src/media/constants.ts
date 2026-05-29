// media constants helpers and runtime behavior.
/** Reused constant for MAX IMAGE BYTES behavior in src/media. */
export const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // 6MB
/** Reused constant for MAX AUDIO BYTES behavior in src/media. */
export const MAX_AUDIO_BYTES = 16 * 1024 * 1024; // 16MB
/** Reused constant for MAX VIDEO BYTES behavior in src/media. */
export const MAX_VIDEO_BYTES = 16 * 1024 * 1024; // 16MB
/** Reused constant for MAX DOCUMENT BYTES behavior in src/media. */
export const MAX_DOCUMENT_BYTES = 100 * 1024 * 1024; // 100MB

/** Shared type for Media Kind in src/media. */
export type MediaKind = "image" | "audio" | "video" | "document";

/** Reused helper for media Kind From Mime behavior in src/media. */
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

/** Reused helper for max Bytes For Kind behavior in src/media. */
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
