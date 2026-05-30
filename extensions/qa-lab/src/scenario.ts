// QA Lab scenario helpers execute transport-backed scenario steps and collect results.
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import type { QaTransportActionName, QaTransportState } from "./qa-transport.js";

/** Runtime context passed to each QA scenario step. */
export type QaScenarioStepContext = {
  state: QaTransportState;
  performAction?: (
    action: QaTransportActionName,
    args: Record<string, unknown>,
  ) => Promise<unknown>;
};

/** One named QA scenario step. */
export type QaScenarioStep = {
  name: string;
  run: (ctx: QaScenarioStepContext) => Promise<string | void>;
};

/** QA scenario definition with ordered executable steps. */
export type QaScenarioDefinition = {
  name: string;
  steps: QaScenarioStep[];
};

/** Result for one QA scenario step. */
export type QaScenarioStepResult = {
  name: string;
  status: "pass" | "fail";
  details?: string;
};

/** Aggregated result for a full QA scenario execution. */
export type QaScenarioResult = {
  name: string;
  status: "pass" | "fail";
  steps: QaScenarioStepResult[];
  details?: string;
};

/** Runs a QA scenario until all steps pass or the first step fails. */
export async function runQaScenario(
  definition: QaScenarioDefinition,
  ctx: QaScenarioStepContext,
): Promise<QaScenarioResult> {
  const steps: QaScenarioStepResult[] = [];

  for (const step of definition.steps) {
    try {
      const details = await step.run(ctx);
      steps.push({
        name: step.name,
        status: "pass",
        ...(details ? { details } : {}),
      });
    } catch (error) {
      const details = formatErrorMessage(error);
      steps.push({
        name: step.name,
        status: "fail",
        details,
      });
      return {
        name: definition.name,
        status: "fail",
        steps,
        details,
      };
    }
  }

  return {
    name: definition.name,
    status: "pass",
    steps,
  };
}
