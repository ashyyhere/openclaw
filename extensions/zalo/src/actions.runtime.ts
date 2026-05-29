// Runtime boundary for extensions/zalo/src actions runtime behavior.
import { sendMessageZalo as sendMessageZaloImpl } from "./send.js";

export const zaloActionsRuntime = {
  sendMessageZalo: sendMessageZaloImpl,
};
