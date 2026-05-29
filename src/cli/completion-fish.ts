/** Fish shell completion string escaping helpers. */
export function escapeFishDescription(value: string): string {
  return value.replace(/'/g, "'\\''");
}

function parseOptionFlags(flags: string): { long?: string; short?: string } {
  const parts = flags.split(/[ ,|]+/);
  const long = parts.find((flag) => flag.startsWith("--"))?.replace(/^--/, "");
  const short = parts
    .find((flag) => flag.startsWith("-") && !flag.startsWith("--"))
    ?.replace(/^-/, "");
  return { long, short };
}

/** Reused helper for build Fish Subcommand Completion Line behavior in src/cli. */
export function buildFishSubcommandCompletionLine(params: {
  rootCmd: string;
  condition: string;
  name: string;
  description: string;
}): string {
  const desc = escapeFishDescription(params.description);
  return `complete -c ${params.rootCmd} -n "${params.condition}" -a "${params.name}" -d '${desc}'\n`;
}

/** Reused helper for build Fish Option Completion Line behavior in src/cli. */
export function buildFishOptionCompletionLine(params: {
  rootCmd: string;
  condition: string;
  flags: string;
  description: string;
}): string {
  const { short, long } = parseOptionFlags(params.flags);
  const desc = escapeFishDescription(params.description);
  let line = `complete -c ${params.rootCmd} -n "${params.condition}"`;
  if (short) {
    line += ` -s ${short}`;
  }
  if (long) {
    line += ` -l ${long}`;
  }
  line += ` -d '${desc}'\n`;
  return line;
}
