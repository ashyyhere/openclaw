// process/supervisor index helpers and runtime behavior.
import { createProcessSupervisor } from "./supervisor.js";
import type { ProcessSupervisor } from "./types.js";

let singleton: ProcessSupervisor | null = null;

/** Reused helper for get Process Supervisor behavior in src/process/supervisor. */
export function getProcessSupervisor(): ProcessSupervisor {
  if (singleton) {
    return singleton;
  }
  singleton = createProcessSupervisor();
  return singleton;
}

/** Re-exported API for src/process/supervisor, starting with create Process Supervisor. */
export { createProcessSupervisor } from "./supervisor.js";
/** Re-exported API for src/process/supervisor. */
export type {
  ManagedRun,
  ProcessSupervisor,
  RunExit,
  RunRecord,
  RunState,
  SpawnInput,
  SpawnMode,
  TerminationReason,
} from "./types.js";
