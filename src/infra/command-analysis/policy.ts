// infra/command-analysis policy helpers and runtime behavior.
import {
  analyzeArgvCommand,
  analyzeShellCommand,
  type ExecCommandAnalysis,
  type ExecCommandSegment,
} from "../exec-approvals-analysis.js";
import { detectInlineEvalInSegments } from "./risks.js";

/** Shared type for Command Policy Analysis in src/infra/command-analysis. */
export type CommandPolicyAnalysis =
  | {
      ok: true;
      source: "argv" | "shell";
      analysis: ExecCommandAnalysis;
      segments: ExecCommandSegment[];
    }
  | {
      ok: false;
      source: "argv" | "shell";
      reason?: string;
      analysis: ExecCommandAnalysis;
      segments: [];
    };

/** Reused helper for analyze Command For Policy behavior in src/infra/command-analysis. */
export function analyzeCommandForPolicy(
  params:
    | {
        source: "shell";
        command: string;
        cwd?: string;
        env?: NodeJS.ProcessEnv;
        platform?: string | null;
      }
    | {
        source: "argv";
        argv: string[];
        cwd?: string;
        env?: NodeJS.ProcessEnv;
      },
): CommandPolicyAnalysis {
  const analysis =
    params.source === "shell"
      ? analyzeShellCommand({
          command: params.command,
          cwd: params.cwd,
          env: params.env,
          platform: params.platform,
        })
      : analyzeArgvCommand({ argv: params.argv, cwd: params.cwd, env: params.env });
  if (!analysis.ok) {
    return {
      ok: false,
      source: params.source,
      reason: analysis.reason,
      analysis,
      segments: [],
    };
  }
  return {
    ok: true,
    source: params.source,
    analysis,
    segments: analysis.segments,
  };
}

/** Reused helper for detect Policy Inline Eval behavior in src/infra/command-analysis. */
export function detectPolicyInlineEval(segments: readonly ExecCommandSegment[]) {
  return detectInlineEvalInSegments(segments);
}
