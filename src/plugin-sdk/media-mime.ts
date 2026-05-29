// Narrow media MIME helper surface for plugins that do not need the full media runtime.

/** Re-exported API for src/plugin-sdk. */
export {
  detectMime,
  extensionForMime,
  getFileExtension,
  mimeTypeFromFilePath,
  normalizeMimeType,
} from "../media/mime.js";
/** Re-exported API for src/plugin-sdk, starting with media Kind From Mime. */
export { mediaKindFromMime, type MediaKind } from "../media/constants.js";
