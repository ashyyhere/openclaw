/** Guards configured tool allowlists against invalid or unsafe entries. */
import { normalizeStringEntries } from "../shared/string-normalization.js";
import { normalizeToolList, normalizeToolName } from "./tool-policy.js";

type ExplicitToolAllowlistSource = {
  label: string;
  entries: string[];
  enforceWhenToolsDisabled?: boolean;
};

/** Collects non-empty explicit allowlists with labels for diagnostics. */
export function collectExplicitToolAllowlistSources(
  sources: Array<{ label: string; allow?: string[]; enforceWhenToolsDisabled?: boolean }>,
): ExplicitToolAllowlistSource[] {
  return sources.flatMap((source) => {
    const entries = normalizeStringEntries(source.allow);
    if (entries.length === 0) {
      return [];
    }
    return [
      {
        label: source.label,
        entries,
        ...(source.enforceWhenToolsDisabled === true ? { enforceWhenToolsDisabled: true } : {}),
      },
    ];
  });
}

/** Builds the operator-facing error when explicit allowlists remove every callable tool. */
export function buildEmptyExplicitToolAllowlistError(params: {
  sources: ExplicitToolAllowlistSource[];
  callableToolNames: string[];
  toolsEnabled: boolean;
  disableTools?: boolean;
}): Error | null {
  const sources =
    params.disableTools === true
      ? params.sources.filter((source) => source.enforceWhenToolsDisabled === true)
      : params.sources;
  const callableToolNames = normalizeToolList(params.callableToolNames);
  if (sources.length === 0 || callableToolNames.length > 0) {
    return null;
  }
  const requested = sources
    .map((source) => `${source.label}: ${source.entries.map(normalizeToolName).join(", ")}`)
    .join("; ");
  const reason =
    params.disableTools === true
      ? "tools are disabled for this run"
      : params.toolsEnabled
        ? "no registered tools matched"
        : "the selected model does not support tools";
  return new Error(
    `No callable tools remain after resolving explicit tool allowlist (${requested}); ${reason}. Fix the allowlist or enable the plugin that registers the requested tool.`,
  );
}
