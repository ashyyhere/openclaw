/** Serializes async skill operations by workspace/key. */
const SKILLS_SYNC_QUEUE = new Map<string, Promise<unknown>>();

/** Runs a task after prior queued work for the same key. */
export async function serializeByKey<T>(key: string, task: () => Promise<T>) {
  const prev = SKILLS_SYNC_QUEUE.get(key) ?? Promise.resolve();
  const next = prev.then(task, task);
  SKILLS_SYNC_QUEUE.set(key, next);
  try {
    return await next;
  } finally {
    if (SKILLS_SYNC_QUEUE.get(key) === next) {
      SKILLS_SYNC_QUEUE.delete(key);
    }
  }
}
