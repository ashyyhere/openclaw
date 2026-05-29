// config/sessions store writer helpers and runtime behavior.
import { runQueuedStoreWrite } from "../../shared/store-writer-queue.js";
import { WRITER_QUEUES } from "./store-writer-state.js";

/** Reused helper for with Session Store Writer For Test behavior in src/config/sessions. */
export async function withSessionStoreWriterForTest<T>(
  storePath: string,
  fn: () => Promise<T>,
): Promise<T> {
  return await runExclusiveSessionStoreWrite(storePath, fn);
}

/** Reused helper for run Exclusive Session Store Write behavior in src/config/sessions. */
export async function runExclusiveSessionStoreWrite<T>(
  storePath: string,
  fn: () => Promise<T>,
): Promise<T> {
  return await runQueuedStoreWrite({
    queues: WRITER_QUEUES,
    storePath,
    label: "runExclusiveSessionStoreWrite",
    fn,
  });
}
