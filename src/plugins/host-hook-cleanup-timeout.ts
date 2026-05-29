// plugins host hook cleanup timeout helpers and runtime behavior.
/** Reused constant for PLUGIN HOST CLEANUP TIMEOUT MS behavior in src/plugins. */
export const PLUGIN_HOST_CLEANUP_TIMEOUT_MS = 5_000;

/** Reused class for Plugin Host Cleanup Timeout Error behavior in src/plugins. */
export class PluginHostCleanupTimeoutError extends Error {
  constructor(hookId: string) {
    super(`plugin host cleanup timed out: ${hookId}`);
    this.name = "PluginHostCleanupTimeoutError";
  }
}

/** Reused helper for with Plugin Host Cleanup Timeout behavior in src/plugins. */
export async function withPluginHostCleanupTimeout<T>(
  hookId: string,
  cleanup: () => T | Promise<T>,
): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;
  try {
    return await Promise.race([
      Promise.resolve().then(cleanup),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
          reject(new PluginHostCleanupTimeoutError(hookId));
        }, PLUGIN_HOST_CLEANUP_TIMEOUT_MS);
        timeout.unref?.();
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}
