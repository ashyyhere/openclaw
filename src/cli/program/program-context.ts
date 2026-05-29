/** Stores OpenClaw program context on Commander command instances. */
import type { Command } from "commander";
import type { ProgramContext } from "./context.js";

const PROGRAM_CONTEXT_SYMBOL: unique symbol = Symbol.for("openclaw.cli.programContext");

/** Reused helper for set Program Context behavior in src/cli/program. */
export function setProgramContext(program: Command, ctx: ProgramContext): void {
  (program as Command & { [PROGRAM_CONTEXT_SYMBOL]?: ProgramContext })[PROGRAM_CONTEXT_SYMBOL] =
    ctx;
}

/** Reused helper for get Program Context behavior in src/cli/program. */
export function getProgramContext(program: Command): ProgramContext | undefined {
  return (program as Command & { [PROGRAM_CONTEXT_SYMBOL]?: ProgramContext })[
    PROGRAM_CONTEXT_SYMBOL
  ];
}
