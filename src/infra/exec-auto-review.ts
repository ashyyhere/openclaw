// infra exec auto review helpers and runtime behavior.
/** Shared type for Exec Auto Review Risk in src/infra. */
export type ExecAutoReviewRisk = "unknown" | "low" | "medium" | "high";

/** Shared type for Exec Auto Review Decision in src/infra. */
export type ExecAutoReviewDecision =
  | {
      decision: "allow-once";
      rationale: string;
      risk: "low" | "medium" | "high";
    }
  | {
      decision: "ask";
      rationale: string;
      risk: ExecAutoReviewRisk;
    };

/** Shared type for Exec Auto Review Host in src/infra. */
export type ExecAutoReviewHost = "gateway" | "node";

/** Shared type for Exec Auto Review Input in src/infra. */
export type ExecAutoReviewInput = {
  command: string;
  argv?: readonly string[];
  cwd?: string | null;
  envKeys?: readonly string[];
  host: ExecAutoReviewHost;
  reason:
    | "approval-required"
    | "allowlist-miss"
    | "strict-inline-eval"
    | "heredoc"
    | "execution-plan-miss";
  analysis: {
    parsed: boolean;
    allowlistMatched: boolean;
    safeBinMatched?: boolean;
    durableApprovalMatched?: boolean;
    inlineEval: boolean;
    heredoc?: boolean;
    shellWrapper?: boolean;
  };
  agent?: {
    id?: string | null;
    sessionKey?: string | null;
  };
};

/** Shared type for Exec Auto Reviewer in src/infra. */
export type ExecAutoReviewer = (
  input: ExecAutoReviewInput,
) => Promise<ExecAutoReviewDecision> | ExecAutoReviewDecision;

/**
 * Conservative fallback used when no model-backed reviewer is available.
 * Auto mode must never become a static allowlist; without a reviewer, defer to
 * the normal human approval route.
 */
export const defaultExecAutoReviewer: ExecAutoReviewer = (input) => {
  return {
    decision: "ask",
    rationale: `no model-backed exec reviewer is configured for ${input.host}`,
    risk: input.analysis.inlineEval ? "medium" : "unknown",
  };
};
