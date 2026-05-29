// media-understanding attachments helpers and runtime behavior.
/** Re-exported API for src/media-understanding. */
export {
  isAudioAttachment,
  normalizeAttachments,
  resolveAttachmentKind,
} from "./attachments.normalize.js";
/** Re-exported API for src/media-understanding, starting with select Attachments. */
export { selectAttachments } from "./attachments.select.js";
/** Re-exported API for src/media-understanding, starting with Media Attachment Cache. */
export { MediaAttachmentCache, type MediaAttachmentCacheOptions } from "./attachments.cache.js";
