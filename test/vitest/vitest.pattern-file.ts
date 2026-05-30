// Vitest pattern-file helpers parse env and CLI include filters for shard configs.
import fs from "node:fs";
import path from "node:path";

function normalizeCliPattern(value: string): string {
  let normalized = value
    .trim()
    .replace(/^\.\/+/u, "")
    .replace(/\/+$/u, "");
  if (
    /^(?:src|test|extensions|ui|packages|apps)(?:\/|$)/u.test(normalized) &&
    !/[?*[\]{}]/u.test(normalized) &&
    !/\.(?:[cm]?[jt]sx?)$/u.test(normalized)
  ) {
    normalized = `${normalized}/**/*.test.*`;
  }
  return normalized;
}

function looksLikeCliIncludePattern(value: string): boolean {
  const normalized = normalizeCliPattern(value);
  return (
    normalized.includes(".test.") ||
    normalized.includes(".e2e.") ||
    normalized.includes(".live.") ||
    /^(?:src|test|extensions|ui|packages|apps)(?:\/|$)/u.test(normalized)
  );
}

function literalPrefixForGlobPattern(value: string): string {
  const normalized = value.replaceAll("\\", "/");
  const globIndex = normalized.search(/[?*[\]{}]/u);
  if (globIndex === -1) {
    return normalized;
  }
  const slashIndex = normalized.lastIndexOf("/", globIndex);
  return slashIndex === -1 ? "" : normalized.slice(0, slashIndex + 1);
}

function patternsCouldOverlap(value: string, pattern: string): boolean {
  if (path.matchesGlob(value, pattern) || path.matchesGlob(pattern, value)) {
    return true;
  }

  const valuePrefix = literalPrefixForGlobPattern(value);
  const patternPrefix = literalPrefixForGlobPattern(pattern);
  return (
    patternPrefix === "" ||
    valuePrefix === "" ||
    valuePrefix.startsWith(patternPrefix) ||
    patternPrefix.startsWith(valuePrefix)
  );
}

/** Loads and validates a JSON string-array pattern list file. */
export function loadPatternListFile(filePath: string, label: string): string[] {
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
  if (!Array.isArray(parsed)) {
    throw new TypeError(`${label} must point to a JSON array: ${filePath}`);
  }
  return parsed.filter((value): value is string => typeof value === "string" && value.length > 0);
}

/** Loads a JSON string-array pattern list from an environment variable path. */
export function loadPatternListFromEnv(
  envKey: string,
  env: Record<string, string | undefined> = process.env,
): string[] | null {
  const filePath = env[envKey]?.trim();
  if (!filePath) {
    return null;
  }
  return loadPatternListFile(filePath, envKey);
}

/** Extracts test include patterns from positional Vitest CLI arguments. */
export function loadPatternListFromArgv(argv: string[] = process.argv): string[] | null {
  const optionValueFlags = new Set([
    "-c",
    "-r",
    "-t",
    "--config",
    "--dir",
    "--environment",
    "--exclude",
    "--maxWorkers",
    "--mode",
    "--outputFile",
    "--pool",
    "--project",
    "--reporter",
    "--root",
    "--shard",
    "--testNamePattern",
  ]);
  const values: string[] = [];
  let skipNext = false;
  for (const value of argv.slice(2)) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (value === "run" || value === "watch" || value === "bench") {
      continue;
    }
    if (optionValueFlags.has(value)) {
      skipNext = true;
      continue;
    }
    if (value.startsWith("-")) {
      continue;
    }
    values.push(value);
  }

  const patterns = values.filter(looksLikeCliIncludePattern).map(normalizeCliPattern);

  return patterns.length > 0 ? [...new Set(patterns)] : null;
}

/** Narrows configured include patterns to CLI-provided patterns that can overlap them. */
export function narrowIncludePatternsForCli(
  includePatterns: string[],
  argv: string[] = process.argv,
): string[] | null {
  const cliPatterns = loadPatternListFromArgv(argv);
  if (!cliPatterns) {
    return null;
  }

  const matched = cliPatterns.filter((value) =>
    includePatterns.some((pattern) => patternsCouldOverlap(value, pattern)),
  );

  return [...new Set(matched)];
}
