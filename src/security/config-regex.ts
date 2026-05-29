// security config regex helpers and runtime behavior.
import {
  compileSafeRegexDetailed,
  type SafeRegexCompileResult,
  type SafeRegexRejectReason,
} from "./safe-regex.js";

/** Shared type for Config Regex Reject Reason in src/security. */
export type ConfigRegexRejectReason = Exclude<SafeRegexRejectReason, "empty">;

/** Shared type for Compiled Config Regex in src/security. */
export type CompiledConfigRegex =
  | {
      regex: RegExp;
      pattern: string;
      flags: string;
      reason: null;
    }
  | {
      regex: null;
      pattern: string;
      flags: string;
      reason: ConfigRegexRejectReason;
    };

function normalizeRejectReason(result: SafeRegexCompileResult): ConfigRegexRejectReason | null {
  if (result.reason === null || result.reason === "empty") {
    return null;
  }
  return result.reason;
}

/** Reused helper for compile Config Regex behavior in src/security. */
export function compileConfigRegex(pattern: string, flags = ""): CompiledConfigRegex | null {
  const result = compileSafeRegexDetailed(pattern, flags);
  if (result.reason === "empty") {
    return null;
  }
  return {
    regex: result.regex,
    pattern: result.source,
    flags: result.flags,
    reason: normalizeRejectReason(result),
  } as CompiledConfigRegex;
}

/** Reused helper for compile Config Regexes behavior in src/security. */
export function compileConfigRegexes(
  patterns: string[],
  flags = "",
): {
  regexes: RegExp[];
  rejected: Array<{
    pattern: string;
    flags: string;
    reason: ConfigRegexRejectReason;
  }>;
} {
  const regexes: RegExp[] = [];
  const rejected: Array<{
    pattern: string;
    flags: string;
    reason: ConfigRegexRejectReason;
  }> = [];

  for (const pattern of patterns) {
    const compiled = compileConfigRegex(pattern, flags);
    if (!compiled) {
      continue;
    }
    if (compiled.regex) {
      regexes.push(compiled.regex);
      continue;
    }
    rejected.push({
      pattern: compiled.pattern,
      flags: compiled.flags,
      reason: compiled.reason,
    });
  }

  return { regexes, rejected };
}
