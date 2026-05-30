// Per-store async write queue that serializes file updates by store path.
/** Pending write task held by a store writer queue. */
export type StoreWriterTask = {
  fn: () => Promise<unknown>;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};

/** FIFO queue state for writes targeting one store path. */
export type StoreWriterQueue = {
  running: boolean;
  pending: StoreWriterTask[];
  drainPromise: Promise<void> | null;
};

/** Registry of writer queues keyed by store path. */
export type StoreWriterQueues = Map<string, StoreWriterQueue>;

function getOrCreateStoreWriterQueue(
  queues: StoreWriterQueues,
  storePath: string,
): StoreWriterQueue {
  const existing = queues.get(storePath);
  if (existing) {
    return existing;
  }
  const created: StoreWriterQueue = { running: false, pending: [], drainPromise: null };
  queues.set(storePath, created);
  return created;
}

async function drainStoreWriterQueue(queues: StoreWriterQueues, storePath: string): Promise<void> {
  const queue = queues.get(storePath);
  if (!queue) {
    return;
  }
  if (queue.drainPromise) {
    await queue.drainPromise;
    return;
  }
  queue.running = true;
  queue.drainPromise = (async () => {
    try {
      while (queue.pending.length > 0) {
        const task = queue.pending.shift();
        if (!task) {
          continue;
        }
        let result: unknown;
        let failed: unknown;
        let hasFailure = false;
        try {
          result = await task.fn();
        } catch (err) {
          hasFailure = true;
          failed = err;
        }
        if (hasFailure) {
          task.reject(failed);
          continue;
        }
        task.resolve(result);
      }
    } finally {
      queue.running = false;
      queue.drainPromise = null;
      if (queue.pending.length === 0) {
        queues.delete(storePath);
      } else {
        queueMicrotask(() => {
          void drainStoreWriterQueue(queues, storePath);
        });
      }
    }
  })();
  await queue.drainPromise;
}

/** Run a write task after earlier writes for the same store path finish. */
export async function runQueuedStoreWrite<T>(params: {
  queues: StoreWriterQueues;
  storePath: string;
  label: string;
  fn: () => Promise<T>;
}): Promise<T> {
  if (!params.storePath || typeof params.storePath !== "string") {
    throw new Error(
      `${params.label}: storePath must be a non-empty string, got ${JSON.stringify(
        params.storePath,
      )}`,
    );
  }
  const queue = getOrCreateStoreWriterQueue(params.queues, params.storePath);
  return await new Promise<T>((resolve, reject) => {
    const task: StoreWriterTask = {
      fn: async () => await params.fn(),
      resolve: (value) => resolve(value as T),
      reject,
    };
    queue.pending.push(task);
    void drainStoreWriterQueue(params.queues, params.storePath);
  });
}

/** Reject and clear pending store writer queues for tests. */
export function clearStoreWriterQueuesForTest(queues: StoreWriterQueues, message: string): void {
  for (const queue of queues.values()) {
    for (const task of queue.pending) {
      task.reject(new Error(message));
    }
  }
  queues.clear();
}

/** Wait for active store writer queues to drain after rejecting pending test tasks. */
export async function drainStoreWriterQueuesForTest(
  queues: StoreWriterQueues,
  message: string,
): Promise<void> {
  while (queues.size > 0) {
    const activeQueues = [...queues.values()];
    for (const queue of activeQueues) {
      for (const task of queue.pending) {
        task.reject(new Error(message));
      }
      queue.pending.length = 0;
    }
    const activeDrains = activeQueues.flatMap((queue) =>
      queue.drainPromise ? [queue.drainPromise] : [],
    );
    if (activeDrains.length === 0) {
      queues.clear();
      return;
    }
    await Promise.allSettled(activeDrains);
  }
}
