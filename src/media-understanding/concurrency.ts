// Media-understanding concurrency wrapper with verbose task-failure logging.
import { logVerbose, shouldLogVerbose } from "../globals.js";
import { runTasksWithConcurrency } from "../utils/run-with-concurrency.js";

/** Run media-understanding tasks with a concurrency limit and best-effort logging. */
export async function runWithConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  limit: number,
): Promise<T[]> {
  const { results } = await runTasksWithConcurrency({
    tasks,
    limit,
    onTaskError(err) {
      if (shouldLogVerbose()) {
        logVerbose(`Media understanding task failed: ${String(err)}`);
      }
    },
  });
  return results;
}
