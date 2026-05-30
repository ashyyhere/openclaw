// Process-local writer queues and test hooks for session store persistence.
import {
  clearStoreWriterQueuesForTest,
  drainStoreWriterQueuesForTest,
  type StoreWriterQueue,
  type StoreWriterTask,
} from "../../shared/store-writer-queue.js";
import { clearSessionStoreCaches } from "./store-cache.js";

/** Session-store writer task shape shared with the generic queue helper. */
export type SessionStoreWriterTask = StoreWriterTask;
/** Session-store writer queue shape shared with the generic queue helper. */
export type SessionStoreWriterQueue = StoreWriterQueue;

/** Per-store-path writer queues used to serialize session store writes. */
export const WRITER_QUEUES = new Map<string, SessionStoreWriterQueue>();

/** Clear session store caches and writer queues for isolated tests. */
export function clearSessionStoreCacheForTest(): void {
  clearSessionStoreCaches();
  clearStoreWriterQueuesForTest(WRITER_QUEUES, "session store queue cleared for test");
}

/** Drain all pending session store writer queues for isolated tests. */
export async function drainSessionStoreWriterQueuesForTest(): Promise<void> {
  await drainStoreWriterQueuesForTest(WRITER_QUEUES, "session store queue cleared for test");
}

/** Return active session store writer queue count for tests. */
export function getSessionStoreWriterQueueSizeForTest(): number {
  return WRITER_QUEUES.size;
}
