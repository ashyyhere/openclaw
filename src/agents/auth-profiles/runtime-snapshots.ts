/** Process-local auth profile store snapshots used by runtime auth resolution. */
import { cloneAuthProfileStore } from "./clone.js";
import { resolveAuthStorePath } from "./path-resolve.js";
import type { AuthProfileStore } from "./types.js";

const runtimeAuthStoreSnapshots = new Map<string, AuthProfileStore>();

function resolveRuntimeStoreKey(agentDir?: string): string {
  return resolveAuthStorePath(agentDir);
}

/** Returns a cloned runtime auth-profile snapshot for an agent dir. */
export function getRuntimeAuthProfileStoreSnapshot(
  agentDir?: string,
): AuthProfileStore | undefined {
  const store = runtimeAuthStoreSnapshots.get(resolveRuntimeStoreKey(agentDir));
  return store ? cloneAuthProfileStore(store) : undefined;
}

/** Checks whether a runtime auth-profile snapshot exists for an agent dir. */
export function hasRuntimeAuthProfileStoreSnapshot(agentDir?: string): boolean {
  return runtimeAuthStoreSnapshots.has(resolveRuntimeStoreKey(agentDir));
}

/** Checks requested and main runtime snapshots for any stored profiles. */
export function hasAnyRuntimeAuthProfileStoreSource(agentDir?: string): boolean {
  const requestedStore = getRuntimeAuthProfileStoreSnapshot(agentDir);
  if (requestedStore && Object.keys(requestedStore.profiles).length > 0) {
    return true;
  }
  if (!agentDir) {
    return false;
  }
  const mainStore = getRuntimeAuthProfileStoreSnapshot();
  return Boolean(mainStore && Object.keys(mainStore.profiles).length > 0);
}

/** Replaces all runtime auth-profile snapshots with cloned entries. */
export function replaceRuntimeAuthProfileStoreSnapshots(
  entries: Array<{ agentDir?: string; store: AuthProfileStore }>,
): void {
  runtimeAuthStoreSnapshots.clear();
  for (const entry of entries) {
    runtimeAuthStoreSnapshots.set(
      resolveRuntimeStoreKey(entry.agentDir),
      cloneAuthProfileStore(entry.store),
    );
  }
}

/** Clears all process-local runtime auth-profile snapshots. */
export function clearRuntimeAuthProfileStoreSnapshots(): void {
  runtimeAuthStoreSnapshots.clear();
}

/** Sets one cloned runtime auth-profile snapshot for an agent dir. */
export function setRuntimeAuthProfileStoreSnapshot(
  store: AuthProfileStore,
  agentDir?: string,
): void {
  runtimeAuthStoreSnapshots.set(resolveRuntimeStoreKey(agentDir), cloneAuthProfileStore(store));
}
