// extensions/whatsapp/src/inbound runtime api helpers and runtime behavior.
/** Re-exported whatsapp plugin public API. */
export {
  DisconnectReason,
  downloadMediaMessage,
  isJidGroup,
  normalizeMessageContent,
} from "baileys";
/** Re-exported whatsapp plugin public API, starting with save Media Buffer. */
export { saveMediaBuffer } from "./save-media.runtime.js";
