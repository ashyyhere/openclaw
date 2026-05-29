// test-utils command runner helpers and runtime behavior.
import { Command } from "commander";

/** Reused helper for run Registered Cli behavior in src/test-utils. */
export async function runRegisteredCli(params: {
  register: (program: Command) => void;
  argv: string[];
}): Promise<void> {
  const program = new Command();
  params.register(program);
  await program.parseAsync(params.argv, { from: "user" });
}
