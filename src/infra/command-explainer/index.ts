// Public facade for shell command explanation helpers.
/** Parses shell source into command explanation metadata. */
export { explainShellCommand } from "./extract.js";
/** Converts command explanation metadata into approval highlight spans. */
export { formatCommandSpans } from "./format.js";
/** Command explanation result, command step, risk, and span types. */
export type {
  CommandContext,
  CommandExplanation,
  CommandRisk,
  CommandShape,
  CommandStep,
  SourceSpan,
} from "./types.js";
