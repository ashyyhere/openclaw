// config/sessions store writer state helpers and runtime behavior.
import {
  clearStoreWriterQueuesForTest,
  drainStoreWriterQueuesForTest,
  type StoreWriterQueue,
  type StoreWriterTask,
} from "../../shared/store-writer-queue.js";
import { clearSessionStoreCaches } from "./store-cache.js";

/** Shared type for Session Store Writer Task in src/config/sessions. */
export type SessionStoreWriterTask = StoreWriterTask;
/** Shared type for Session Store Writer Queue in src/config/sessions. */
export type SessionStoreWriterQueue = StoreWriterQueue;

/** Reused constant for WRITER QUEUES behavior in src/config/sessions. */
export const WRITER_QUEUES = new Map<string, SessionStoreWriterQueue>();

/** Reused helper for clear Session Store Cache For Test behavior in src/config/sessions. */
export function clearSessionStoreCacheForTest(): void {
  clearSessionStoreCaches();
  clearStoreWriterQueuesForTest(WRITER_QUEUES, "session store queue cleared for test");
}

/** Reused helper for drain Session Store Writer Queues For Test behavior in src/config/sessions. */
export async function drainSessionStoreWriterQueuesForTest(): Promise<void> {
  await drainStoreWriterQueuesForTest(WRITER_QUEUES, "session store queue cleared for test");
}

/** Reused helper for get Session Store Writer Queue Size For Test behavior in src/config/sessions. */
export function getSessionStoreWriterQueueSizeForTest(): number {
  return WRITER_QUEUES.size;
}
