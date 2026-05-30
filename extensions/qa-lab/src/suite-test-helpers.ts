// QA suite test helpers build minimal scenario catalog entries for unit tests.
import { readQaBootstrapScenarioCatalog } from "./scenario-catalog.js";

type QaSuiteTestScenario = ReturnType<typeof readQaBootstrapScenarioCatalog>["scenarios"][number];

/** Build a minimal QA suite scenario with optional runtime/config overrides. */
export function makeQaSuiteTestScenario(
  id: string,
  params: {
    config?: Record<string, unknown>;
    plugins?: string[];
    gatewayConfigPatch?: Record<string, unknown>;
    gatewayRuntime?: { forwardHostHome?: boolean };
    runtimeParityTier?: QaSuiteTestScenario["runtimeParityTier"];
    surface?: string;
  } = {},
): QaSuiteTestScenario {
  return {
    id,
    title: id,
    surface: params.surface ?? "test",
    objective: "test",
    successCriteria: ["test"],
    ...(params.runtimeParityTier ? { runtimeParityTier: params.runtimeParityTier } : {}),
    ...(params.plugins ? { plugins: params.plugins } : {}),
    ...(params.gatewayConfigPatch ? { gatewayConfigPatch: params.gatewayConfigPatch } : {}),
    ...(params.gatewayRuntime ? { gatewayRuntime: params.gatewayRuntime } : {}),
    sourcePath: `qa/scenarios/${id}.md`,
    execution: {
      kind: "flow",
      ...(params.config ? { config: params.config } : {}),
      flow: { steps: [{ name: "noop", actions: [{ assert: "true" }] }] },
    },
  } as QaSuiteTestScenario;
}
