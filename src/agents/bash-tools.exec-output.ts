/** Shared rendering helpers for exec tool output text. */
const EXEC_NO_OUTPUT_PLACEHOLDER = "(no output)";

/** Render exec output with a stable no-output placeholder. */
export function renderExecOutputText(value: string | undefined): string {
  return value || EXEC_NO_OUTPUT_PLACEHOLDER;
}

/** Render an exec update with warning text and tail output. */
export function renderExecUpdateText(params: { tailText?: string; warnings: string[] }): string {
  const warningText = params.warnings.length ? `${params.warnings.join("\n")}\n\n` : "";
  return warningText + renderExecOutputText(params.tailText);
}
