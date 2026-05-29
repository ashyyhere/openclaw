// OpenClaw CLI command construction helpers.
function quoteShellArg(value: string): string {
  if (process.platform === "win32") {
    return `'${value.replaceAll("'", "''")}'`;
  }
  return `'${value.replaceAll("'", "'\\''")}'`;
}

/** Reused helper for build Current Open Claw Cli Argv behavior in src/auto-reply/reply. */
export function buildCurrentOpenClawCliArgv(args: string[]): string[] {
  const entry = process.argv[1]?.trim();
  return entry && entry !== process.execPath
    ? [process.execPath, ...process.execArgv, entry, ...args]
    : [process.execPath, ...args];
}

/** Reused helper for build Current Open Claw Cli Command behavior in src/auto-reply/reply. */
export function buildCurrentOpenClawCliCommand(args: string[]): string {
  return buildCurrentOpenClawCliArgv(args).map(quoteShellArg).join(" ");
}
