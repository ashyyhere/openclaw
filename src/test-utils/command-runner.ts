// Commander CLI runner helper for command registration tests.
import { Command } from "commander";

/** Register a CLI command tree and parse user-style argv. */
export async function runRegisteredCli(params: {
  register: (program: Command) => void;
  argv: string[];
}): Promise<void> {
  const program = new Command();
  params.register(program);
  await program.parseAsync(params.argv, { from: "user" });
}
