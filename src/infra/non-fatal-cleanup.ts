// Runs cleanup hooks without letting cleanup failures mask primary work.
/** Runs cleanup and reports errors through an optional callback instead of throwing. */
export async function runBestEffortCleanup<T>(params: {
  cleanup: () => Promise<T>;
  onError?: (error: unknown) => void;
}): Promise<T | undefined> {
  try {
    return await params.cleanup();
  } catch (error) {
    params.onError?.(error);
    return undefined;
  }
}
