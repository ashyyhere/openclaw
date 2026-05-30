// QA Lab live-transport artifact helpers format failure details and file paths.
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";

/** Appends a formatted live-lane issue without throwing away the original label. */
export function appendQaLiveLaneIssue(issues: string[], label: string, error: unknown) {
  issues.push(`${label}: ${formatErrorMessage(error)}`);
}

/** Builds an error message that points maintainers at generated QA artifacts. */
export function buildQaLiveLaneArtifactsError(params: {
  heading: string;
  artifacts: Record<string, string>;
  details?: string[];
}) {
  return [
    params.heading,
    ...(params.details ?? []),
    "Artifacts:",
    ...Object.entries(params.artifacts).map(([label, filePath]) => `- ${label}: ${filePath}`),
  ].join("\n");
}

/** Prints generated artifact paths in the stable format consumed by CI logs. */
export function printLiveTransportQaArtifacts(
  laneLabel: string,
  artifacts: Record<string, string>,
) {
  for (const [label, filePath] of Object.entries(artifacts)) {
    process.stdout.write(`${laneLabel} ${label}: ${filePath}\n`);
  }
}
