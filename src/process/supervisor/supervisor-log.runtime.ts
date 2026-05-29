// Runtime boundary for process/supervisor supervisor log runtime behavior.
import { createSubsystemLogger } from "../../logging/subsystem.js";

const log = createSubsystemLogger("process/supervisor");

/** Reused helper for warn Process Supervisor Spawn Failure behavior in src/process/supervisor. */
export function warnProcessSupervisorSpawnFailure(message: string) {
  log.warn(message);
}
