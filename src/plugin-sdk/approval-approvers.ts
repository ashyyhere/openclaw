/** Public SDK helper for deriving approval approvers from explicit and inferred allowlists. */
import { uniqueStrings } from "../shared/string-normalization.js";

type ApproverInput = string | number;

function dedupeDefined(values: Array<string | undefined>): string[] {
  return uniqueStrings(values.filter((value): value is string => Boolean(value)));
}

/** Resolve the ordered approver list, preferring explicit approvers over inferred fallbacks. */
export function resolveApprovalApprovers(params: {
  explicit?: readonly ApproverInput[] | null;
  allowFrom?: readonly ApproverInput[] | null;
  extraAllowFrom?: readonly ApproverInput[] | null;
  defaultTo?: string | null;
  normalizeApprover: (value: ApproverInput) => string | undefined;
  normalizeDefaultTo?: (value: string) => string | undefined;
}): string[] {
  const explicit = dedupeDefined(
    (params.explicit ?? []).map((entry) => params.normalizeApprover(entry)),
  );
  if (explicit.length > 0) {
    return explicit;
  }

  // Inferred approvers intentionally combine configured allowFrom sources before defaultTo, so
  // existing channel allowlists remain the primary approval audience.
  const inferred = dedupeDefined([
    ...(params.allowFrom ?? []).map((entry) => params.normalizeApprover(entry)),
    ...(params.extraAllowFrom ?? []).map((entry) => params.normalizeApprover(entry)),
    ...(params.defaultTo?.trim()
      ? [
          (params.normalizeDefaultTo ?? ((value: string) => params.normalizeApprover(value)))(
            params.defaultTo.trim(),
          ),
        ]
      : []),
  ]);
  return inferred;
}
