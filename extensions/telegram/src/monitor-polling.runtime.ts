// Runtime boundary for extensions/telegram/src monitor polling runtime behavior.
export { TelegramPollingSession } from "./polling-session.js";
export {
  deleteTelegramUpdateOffset,
  readTelegramUpdateOffset,
  writeTelegramUpdateOffset,
} from "./update-offset-store.js";
