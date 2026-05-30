/** Reads precomputed startup metadata for root help rendering. */
import { readCliStartupMetadata } from "./startup-metadata.js";

/** Subcommands whose help text may be precomputed into startup metadata. */
export type PrecomputedSubcommandHelpName = "doctor" | "gateway" | "models" | "plugins";

let precomputedRootHelpText: string | null | undefined;
let precomputedBrowserHelpText: string | null | undefined;
let precomputedSecretsHelpText: string | null | undefined;
let precomputedNodesHelpText: string | null | undefined;
let precomputedSubcommandHelpText:
  | Partial<Record<PrecomputedSubcommandHelpName, string | null>>
  | undefined;

type PrecomputedHelpTextKey =
  | "rootHelpText"
  | "browserHelpText"
  | "secretsHelpText"
  | "nodesHelpText";

function loadPrecomputedHelpText(
  key: PrecomputedHelpTextKey,
  cache: string | null | undefined,
  setCache: (value: string | null) => void,
): string | null {
  if (cache !== undefined) {
    return cache;
  }
  try {
    const parsed = readCliStartupMetadata(import.meta.url);
    if (parsed) {
      const value = parsed[key];
      if (typeof value === "string" && value.length > 0) {
        setCache(value);
        return value;
      }
    }
  } catch {
    // Fall back to live help rendering.
  }
  setCache(null);
  return null;
}

/** Loads cached root help text from startup metadata when available. */
export function loadPrecomputedRootHelpText(): string | null {
  return loadPrecomputedHelpText("rootHelpText", precomputedRootHelpText, (value) => {
    precomputedRootHelpText = value;
  });
}

/** Loads cached browser help text from startup metadata when available. */
export function loadPrecomputedBrowserHelpText(): string | null {
  return loadPrecomputedHelpText("browserHelpText", precomputedBrowserHelpText, (value) => {
    precomputedBrowserHelpText = value;
  });
}

/** Loads cached secrets help text from startup metadata when available. */
export function loadPrecomputedSecretsHelpText(): string | null {
  return loadPrecomputedHelpText("secretsHelpText", precomputedSecretsHelpText, (value) => {
    precomputedSecretsHelpText = value;
  });
}

/** Loads cached nodes help text from startup metadata when available. */
export function loadPrecomputedNodesHelpText(): string | null {
  return loadPrecomputedHelpText("nodesHelpText", precomputedNodesHelpText, (value) => {
    precomputedNodesHelpText = value;
  });
}

/** Loads cached help text for a supported subcommand. */
export function loadPrecomputedSubcommandHelpText(commandName: string): string | null {
  if (!isPrecomputedSubcommandHelpName(commandName)) {
    return null;
  }
  const cache = precomputedSubcommandHelpText?.[commandName];
  if (cache !== undefined) {
    return cache;
  }
  try {
    const parsed = readCliStartupMetadata(import.meta.url);
    const subcommandHelpText = parsed?.subcommandHelpText;
    if (isSubcommandHelpTextRecord(subcommandHelpText)) {
      const value = subcommandHelpText[commandName];
      if (typeof value === "string" && value.length > 0) {
        setPrecomputedSubcommandHelpText(commandName, value);
        return value;
      }
    }
  } catch {
    // Fall back to live help rendering.
  }
  setPrecomputedSubcommandHelpText(commandName, null);
  return null;
}

/** Writes precomputed root help to stdout when metadata contains it. */
export function outputPrecomputedRootHelpText(): boolean {
  const rootHelpText = loadPrecomputedRootHelpText();
  if (!rootHelpText) {
    return false;
  }
  process.stdout.write(rootHelpText);
  return true;
}

/** Writes precomputed browser help to stdout when metadata contains it. */
export function outputPrecomputedBrowserHelpText(): boolean {
  const browserHelpText = loadPrecomputedBrowserHelpText();
  if (!browserHelpText) {
    return false;
  }
  process.stdout.write(browserHelpText);
  return true;
}

/** Writes precomputed secrets help to stdout when metadata contains it. */
export function outputPrecomputedSecretsHelpText(): boolean {
  const secretsHelpText = loadPrecomputedSecretsHelpText();
  if (!secretsHelpText) {
    return false;
  }
  process.stdout.write(secretsHelpText);
  return true;
}

/** Writes precomputed nodes help to stdout when metadata contains it. */
export function outputPrecomputedNodesHelpText(): boolean {
  const nodesHelpText = loadPrecomputedNodesHelpText();
  if (!nodesHelpText) {
    return false;
  }
  process.stdout.write(nodesHelpText);
  return true;
}

/** Writes precomputed subcommand help to stdout when metadata contains it. */
export function outputPrecomputedSubcommandHelpText(commandName: string): boolean {
  const helpText = loadPrecomputedSubcommandHelpText(commandName);
  if (!helpText) {
    return false;
  }
  process.stdout.write(helpText);
  return true;
}

function isPrecomputedSubcommandHelpName(
  commandName: string,
): commandName is PrecomputedSubcommandHelpName {
  return (
    commandName === "doctor" ||
    commandName === "gateway" ||
    commandName === "models" ||
    commandName === "plugins"
  );
}

function isSubcommandHelpTextRecord(
  value: unknown,
): value is Partial<Record<PrecomputedSubcommandHelpName, unknown>> {
  return typeof value === "object" && value !== null;
}

function setPrecomputedSubcommandHelpText(
  commandName: PrecomputedSubcommandHelpName,
  value: string | null,
): void {
  precomputedSubcommandHelpText = {
    ...precomputedSubcommandHelpText,
    [commandName]: value,
  };
}

/** Test hooks for resetting precomputed help metadata caches. */
export const testing = {
  resetPrecomputedRootHelpTextForTests(): void {
    precomputedRootHelpText = undefined;
    precomputedBrowserHelpText = undefined;
    precomputedSecretsHelpText = undefined;
    precomputedNodesHelpText = undefined;
    precomputedSubcommandHelpText = undefined;
  },
};
/** Private test-only alias for root help metadata cache hooks. */
export { testing as __testing };
