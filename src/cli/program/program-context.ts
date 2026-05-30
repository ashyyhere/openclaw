import type { Command } from "commander";
import type { ProgramContext } from "./context.js";

const PROGRAM_CONTEXT_SYMBOL: unique symbol = Symbol.for("openclaw.cli.programContext");

/** Attach immutable CLI program context to Commander without exposing it as options. */
export function setProgramContext(program: Command, ctx: ProgramContext): void {
  (program as Command & { [PROGRAM_CONTEXT_SYMBOL]?: ProgramContext })[PROGRAM_CONTEXT_SYMBOL] =
    ctx;
}

/** Read CLI program context previously attached during root program construction. */
export function getProgramContext(program: Command): ProgramContext | undefined {
  return (program as Command & { [PROGRAM_CONTEXT_SYMBOL]?: ProgramContext })[
    PROGRAM_CONTEXT_SYMBOL
  ];
}
