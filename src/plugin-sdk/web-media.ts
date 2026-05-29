/** Public SDK barrel for web media extraction helpers. */
export {
  getDefaultLocalRoots,
  LocalMediaAccessError,
  loadWebMedia,
  loadWebMediaRaw,
  optimizeImageToJpeg,
  optimizeImageToPng,
  type WebMediaResult,
} from "../media/web-media.js";
/** Re-exported API for src/plugin-sdk, starting with Local Media Access Error Code. */
export type { LocalMediaAccessErrorCode } from "../media/web-media.js";
