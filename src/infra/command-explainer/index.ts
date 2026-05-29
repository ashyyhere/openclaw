// infra/command-explainer index helpers and runtime behavior.
/** Re-exported API for src/infra/command-explainer, starting with explain Shell Command. */
export { explainShellCommand } from "./extract.js";
/** Re-exported API for src/infra/command-explainer, starting with format Command Spans. */
export { formatCommandSpans } from "./format.js";
/** Re-exported API for src/infra/command-explainer. */
export type {
  CommandContext,
  CommandExplanation,
  CommandRisk,
  CommandShape,
  CommandStep,
  SourceSpan,
} from "./types.js";
