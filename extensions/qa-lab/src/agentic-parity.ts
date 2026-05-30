// QA Lab agentic parity helpers define the scenario pack used for provider comparison.
import { uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";

const QA_AGENTIC_PARITY_PACK = "agentic";

const QA_AGENTIC_PARITY_SCENARIOS = [
  {
    id: "approval-turn-tool-followthrough",
    title: "Approval turn tool followthrough",
    countsTowardValidToolCallRate: true,
  },
  {
    id: "model-switch-tool-continuity",
    title: "Model switch with tool continuity",
    countsTowardValidToolCallRate: true,
  },
  {
    id: "source-docs-discovery-report",
    title: "Source and docs discovery report",
    countsTowardValidToolCallRate: true,
  },
  {
    id: "image-understanding-attachment",
    title: "Image understanding from attachment",
    countsTowardValidToolCallRate: false,
  },
  {
    id: "compaction-retry-mutating-tool",
    title: "Compaction retry after mutating tool",
    countsTowardValidToolCallRate: true,
  },
  {
    id: "subagent-handoff",
    title: "Subagent handoff",
    countsTowardValidToolCallRate: true,
  },
  {
    id: "subagent-fanout-synthesis",
    title: "Subagent fanout synthesis",
    countsTowardValidToolCallRate: true,
  },
  {
    id: "subagent-stale-child-links",
    title: "Subagent stale child links",
    countsTowardValidToolCallRate: false,
  },
  {
    id: "memory-recall",
    title: "Memory recall after context switch",
    countsTowardValidToolCallRate: false,
  },
  {
    id: "thread-memory-isolation",
    title: "Thread memory isolation",
    countsTowardValidToolCallRate: true,
  },
  {
    id: "config-restart-capability-flip",
    title: "Config restart capability flip",
    countsTowardValidToolCallRate: true,
  },
  {
    id: "instruction-followthrough-repo-contract",
    title: "Instruction followthrough repo contract",
    countsTowardValidToolCallRate: true,
  },
] as const;

/** Scenario ids included when `--parity-pack agentic` expands the requested run. */
export const QA_AGENTIC_PARITY_SCENARIO_IDS = QA_AGENTIC_PARITY_SCENARIOS.map(({ id }) => id);
/** Human-readable scenario titles for agentic parity reports. */
export const QA_AGENTIC_PARITY_SCENARIO_TITLES = QA_AGENTIC_PARITY_SCENARIOS.map(
  ({ title }) => title,
);
/** Scenario titles whose outcomes count toward the valid tool-call parity rate. */
export const QA_AGENTIC_PARITY_TOOL_BACKED_SCENARIO_TITLES = QA_AGENTIC_PARITY_SCENARIOS.filter(
  ({ countsTowardValidToolCallRate }) => countsTowardValidToolCallRate,
).map(({ title }) => title);

/** Expands a named parity pack into explicit scenario ids while preserving user selections. */
export function resolveQaParityPackScenarioIds(params: {
  parityPack?: string;
  scenarioIds?: string[];
}): string[] {
  const normalizedPack = params.parityPack?.trim().toLowerCase();
  const explicitScenarioIds = uniqueStrings(params.scenarioIds ?? []);
  if (!normalizedPack) {
    return explicitScenarioIds;
  }
  if (normalizedPack !== QA_AGENTIC_PARITY_PACK) {
    throw new Error(
      `--parity-pack must be "${QA_AGENTIC_PARITY_PACK}", got "${params.parityPack}"`,
    );
  }

  return uniqueStrings([...explicitScenarioIds, ...QA_AGENTIC_PARITY_SCENARIO_IDS]);
}
