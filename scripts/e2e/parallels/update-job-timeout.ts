// Parallels update job timeout helper records timeout failures in guest update logs.
interface TimedUpdateJobOptions {
  append(this: void, chunk: string): void;
  label: string;
  run(this: void): Promise<void> | void;
  timeoutDescription: string;
  timeoutMs: number;
  writeLog(this: void): Promise<void>;
}

/** Runs an update job with a hard timeout and writes accumulated log output. */
export async function runTimedUpdateJob({
  append,
  label,
  run,
  timeoutDescription,
  timeoutMs,
  writeLog,
}: TimedUpdateJobOptions): Promise<number> {
  let timedOut = false;
  const timeoutMessage = `${label} update timed out after ${timeoutDescription}`;
  let timeout: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      timedOut = true;
      append(`${timeoutMessage}\n`);
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  try {
    await Promise.race([Promise.resolve(run()), timeoutPromise]);
    await writeLog();
    return 0;
  } catch (error) {
    if (!timedOut) {
      append(`${error instanceof Error ? error.message : String(error)}\n`);
    }
    await writeLog();
    return 1;
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}
