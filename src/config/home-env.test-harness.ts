// config home env test harness helpers and runtime behavior.
import { createTempHomeEnv } from "../test-utils/temp-home.js";

/** Reused helper for with Temp Home behavior in src/config. */
export async function withTempHome<T>(
  prefix: string,
  fn: (home: string) => Promise<T>,
): Promise<T> {
  const tempHome = await createTempHomeEnv(prefix);

  try {
    return await fn(tempHome.home);
  } finally {
    await tempHome.restore();
  }
}
