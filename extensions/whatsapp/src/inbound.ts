// extensions/whatsapp/src inbound helpers and runtime behavior.
export { resetWebInboundDedupe } from "./inbound/dedupe.js";
export {
  extractContactContext,
  extractLocationData,
  extractMediaPlaceholder,
  extractText,
} from "./inbound/extract.js";
export { monitorWebInbox } from "./inbound/monitor.js";
export type { WebInboundMessage, WebListenerCloseReason } from "./inbound/types.js";
