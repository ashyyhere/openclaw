// Bounded child-output helpers keep CLI subprocess diagnostics within error-size limits.
const DEFAULT_MAX_OUTPUT_CHARS = 16_384;

/** Captured subprocess output with truncation state. */
export type BoundedChildOutput = {
  text: string;
  truncated: boolean;
};

/** Creates an empty bounded output accumulator. */
export function emptyBoundedChildOutput(): BoundedChildOutput {
  return { text: "", truncated: false };
}

/** Appends subprocess output while retaining only the newest bounded suffix. */
export function appendBoundedChildOutput(
  current: BoundedChildOutput,
  chunk: string,
  maxChars = DEFAULT_MAX_OUTPUT_CHARS,
): BoundedChildOutput {
  const appended = current.text + chunk;
  if (appended.length <= maxChars) {
    return { text: appended, truncated: current.truncated };
  }
  return {
    text: appended.slice(-maxChars),
    truncated: true,
  };
}

/** Formats bounded subprocess output with a truncation marker when needed. */
export function formatBoundedChildOutput(output: BoundedChildOutput): string {
  return output.truncated ? `[output truncated]\n${output.text}` : output.text;
}
