// Runtime import type contracts for command registry routing.
import type { ShouldHandleTextCommandsParams } from "./commands-registry.types.js";

/** Runtime-loaded predicate for text command routing. */
export type ShouldHandleTextCommands = (params: ShouldHandleTextCommandsParams) => boolean;
