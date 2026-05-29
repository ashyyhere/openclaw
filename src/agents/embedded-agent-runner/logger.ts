/** Logger for embedded-agent runner subsystem. */
import { createSubsystemLogger } from "../../logging/subsystem.js";

/** Reused constant for log behavior in src/agents/embedded-agent-runner. */
export const log = createSubsystemLogger("agent/embedded");
