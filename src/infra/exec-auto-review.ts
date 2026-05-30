// Exec approval auto-review contracts.
// Model-backed reviewers can approve low-risk commands; fallback always asks.
/** Risk level returned by an exec auto reviewer. */
export type ExecAutoReviewRisk = "unknown" | "low" | "medium" | "high";

/** Auto-review decision used before falling back to human approval. */
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

/** Runtime host that requested exec approval review. */
export type ExecAutoReviewHost = "gateway" | "node";

/** Command facts and parser analysis passed to an exec auto reviewer. */
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

/** Reviewer function that may allow a command once or require approval. */
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
