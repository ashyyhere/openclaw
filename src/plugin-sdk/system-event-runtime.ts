// System event queue helpers without the broad infra-runtime barrel.

/** Re-exported API for src/plugin-sdk. */
export {
  enqueueSystemEvent,
  peekSystemEventEntries,
  resetSystemEventsForTest,
} from "../infra/system-events.js";
