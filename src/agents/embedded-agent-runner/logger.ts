/** Logger for embedded-agent runner subsystem. */
import { createSubsystemLogger } from "../../logging/subsystem.js";

/** Shared subsystem logger for embedded-agent runner internals. */
export const log = createSubsystemLogger("agent/embedded");
