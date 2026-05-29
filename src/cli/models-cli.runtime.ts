/** Runtime implementation for model catalog CLI commands. */
import type { Command } from "commander";
import { defaultRuntime } from "../runtime.js";
import { resolveOptionFromCommand, runCommandWithRuntime } from "./cli-utils.js";
import { formatCliCommand } from "./command-format.js";

/** Re-exported API for src/cli, starting with default Runtime. */
export { defaultRuntime };

/** Reused helper for run Models Command behavior in src/cli. */
export function runModelsCommand(action: () => Promise<void>) {
  return runCommandWithRuntime(defaultRuntime, action);
}

/** Reused helper for resolve Model Agent Option behavior in src/cli. */
export function resolveModelAgentOption(
  command: Command | undefined,
  opts?: { agent?: unknown },
): string | undefined {
  return (
    resolveOptionFromCommand<string>(command, "agent") ??
    (typeof opts?.agent === "string" ? opts.agent : undefined)
  );
}

/** Reused helper for reject Agent Scoped Model Write behavior in src/cli. */
export function rejectAgentScopedModelWrite(
  command: Command,
  commandName: "set" | "set-image",
): void {
  const agent = resolveOptionFromCommand<string>(command, "agent");
  if (!agent) {
    return;
  }
  throw new Error(
    `openclaw models ${commandName} does not support --agent; it only updates global model defaults. Remove --agent, or run ${formatCliCommand("openclaw agents list")} and set the per-agent model in agent config.`,
  );
}
