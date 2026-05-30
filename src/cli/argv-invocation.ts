import {
  getCommandPathWithRootOptions,
  getPrimaryCommand,
  isHelpOrVersionInvocation,
  isRootHelpInvocation,
} from "./argv.js";

/** Parsed root-command facts reused by startup and respawn policy. */
export type CliArgvInvocation = {
  argv: string[];
  commandPath: string[];
  primary: string | null;
  hasHelpOrVersion: boolean;
  isRootHelpInvocation: boolean;
};

/** Extracts root command path, primary command, and help/version state from raw argv. */
export function resolveCliArgvInvocation(argv: string[]): CliArgvInvocation {
  return {
    argv,
    commandPath: getCommandPathWithRootOptions(argv, 2),
    primary: getPrimaryCommand(argv),
    hasHelpOrVersion: isHelpOrVersionInvocation(argv),
    isRootHelpInvocation: isRootHelpInvocation(argv),
  };
}
