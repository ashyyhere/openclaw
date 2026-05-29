import { theme } from "../../packages/terminal-core/src/theme.js";

type PluginUpdateCliOutcome = {
  status: string;
  message: string;
};

/** Reused helper for log Plugin Update Outcomes behavior in src/cli. */
export function logPluginUpdateOutcomes(params: {
  outcomes: readonly PluginUpdateCliOutcome[];
  log: (message: string) => void;
}): { hasErrors: boolean } {
  let hasErrors = false;
  for (const outcome of params.outcomes) {
    if (outcome.status === "error") {
      hasErrors = true;
      params.log(theme.error(outcome.message));
      continue;
    }
    if (outcome.status === "skipped") {
      params.log(theme.warn(outcome.message));
      continue;
    }
    params.log(outcome.message);
  }
  return { hasErrors };
}
