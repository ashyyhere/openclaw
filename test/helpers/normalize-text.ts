import { stripAnsi } from "../../packages/terminal-core/src/ansi.js";

/** Normalize CLI/test output before text snapshot comparisons. */
export function normalizeTestText(input: string): string {
  return stripAnsi(input)
    .replaceAll("\r\n", "\n")
    .replaceAll("…", "...")
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "?")
    .replace(/[\uD800-\uDFFF]/g, "?");
}
