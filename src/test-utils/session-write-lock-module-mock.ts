// test-utils session write lock module mock helpers and runtime behavior.
import type * as SessionWriteLockModule from "../agents/session-write-lock.js";

type SessionWriteLockModuleShape = typeof SessionWriteLockModule;

/** Reused helper for build Session Write Lock Module Mock behavior in src/test-utils. */
export async function buildSessionWriteLockModuleMock(
  loadActual: () => Promise<SessionWriteLockModuleShape>,
  acquireSessionWriteLock: SessionWriteLockModuleShape["acquireSessionWriteLock"],
): Promise<SessionWriteLockModuleShape> {
  const original = await loadActual();
  return {
    ...original,
    acquireSessionWriteLock,
  };
}
