import { sanitizeTerminalText } from "../../packages/terminal-core/src/safe-text.js";
import type { ConfigValidationIssue } from "./types.js";

/** Shared type for Config Issue Line Input in src/config. */
export type ConfigIssueLineInput = {
  path?: string | null;
  message: string;
};

type ConfigIssueFormatOptions = {
  normalizeRoot?: boolean;
};

type ConfigIssueSummaryOptions = ConfigIssueFormatOptions & {
  maxIssues?: number;
};

/** Reused helper for normalize Config Issue Path behavior in src/config. */
export function normalizeConfigIssuePath(path: string | null | undefined): string {
  if (typeof path !== "string") {
    return "<root>";
  }
  const trimmed = path.trim();
  return trimmed ? trimmed : "<root>";
}

/** Reused helper for normalize Config Issue behavior in src/config. */
export function normalizeConfigIssue(issue: ConfigValidationIssue): ConfigValidationIssue {
  const hasAllowedValues = Array.isArray(issue.allowedValues) && issue.allowedValues.length > 0;
  return {
    path: normalizeConfigIssuePath(issue.path),
    message: issue.message,
    ...(hasAllowedValues ? { allowedValues: issue.allowedValues } : {}),
    ...(hasAllowedValues &&
    typeof issue.allowedValuesHiddenCount === "number" &&
    issue.allowedValuesHiddenCount > 0
      ? { allowedValuesHiddenCount: issue.allowedValuesHiddenCount }
      : {}),
  };
}

/** Reused helper for normalize Config Issues behavior in src/config. */
export function normalizeConfigIssues(
  issues: ReadonlyArray<ConfigValidationIssue>,
): ConfigValidationIssue[] {
  return issues.map((issue) => normalizeConfigIssue(issue));
}

function resolveIssuePathForLine(
  path: string | null | undefined,
  opts?: ConfigIssueFormatOptions,
): string {
  if (opts?.normalizeRoot) {
    return normalizeConfigIssuePath(path);
  }
  return typeof path === "string" ? path : "";
}

/** Reused helper for format Config Issue Line behavior in src/config. */
export function formatConfigIssueLine(
  issue: ConfigIssueLineInput,
  marker = "-",
  opts?: ConfigIssueFormatOptions,
): string {
  const prefix = marker ? `${marker} ` : "";
  const path = sanitizeTerminalText(resolveIssuePathForLine(issue.path, opts));
  const message = sanitizeTerminalText(issue.message);
  return `${prefix}${path}: ${message}`;
}

/** Reused helper for format Config Issue Lines behavior in src/config. */
export function formatConfigIssueLines(
  issues: ReadonlyArray<ConfigIssueLineInput>,
  marker = "-",
  opts?: ConfigIssueFormatOptions,
): string[] {
  return issues.map((issue) => formatConfigIssueLine(issue, marker, opts));
}

/** Reused helper for format Config Issue Summary behavior in src/config. */
export function formatConfigIssueSummary(
  issues: ReadonlyArray<ConfigIssueLineInput>,
  opts: ConfigIssueSummaryOptions = {},
): string | null {
  if (issues.length === 0) {
    return null;
  }
  const maxIssueCandidate = Math.floor(opts.maxIssues ?? 5);
  const maxIssues = Number.isFinite(maxIssueCandidate) ? Math.max(1, maxIssueCandidate) : 5;
  const visibleIssues = issues.slice(0, maxIssues);
  const lines = formatConfigIssueLines(visibleIssues, "", {
    normalizeRoot: opts.normalizeRoot ?? true,
  });
  const hiddenIssueCount = issues.length - visibleIssues.length;
  if (hiddenIssueCount <= 0) {
    return lines.join("; ");
  }
  return `${lines.join("; ")}; and ${hiddenIssueCount} more`;
}
