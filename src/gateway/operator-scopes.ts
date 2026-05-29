// gateway operator scopes helpers and runtime behavior.
/** Reused constant for ADMIN SCOPE behavior in src/gateway. */
export const ADMIN_SCOPE = "operator.admin" as const;
/** Reused constant for READ SCOPE behavior in src/gateway. */
export const READ_SCOPE = "operator.read" as const;
/** Reused constant for WRITE SCOPE behavior in src/gateway. */
export const WRITE_SCOPE = "operator.write" as const;
/** Reused constant for APPROVALS SCOPE behavior in src/gateway. */
export const APPROVALS_SCOPE = "operator.approvals" as const;
/** Reused constant for PAIRING SCOPE behavior in src/gateway. */
export const PAIRING_SCOPE = "operator.pairing" as const;
/** Reused constant for TALK SECRETS SCOPE behavior in src/gateway. */
export const TALK_SECRETS_SCOPE = "operator.talk.secrets" as const;

/** Shared type for Operator Scope in src/gateway. */
export type OperatorScope =
  | typeof ADMIN_SCOPE
  | typeof READ_SCOPE
  | typeof WRITE_SCOPE
  | typeof APPROVALS_SCOPE
  | typeof PAIRING_SCOPE
  | typeof TALK_SECRETS_SCOPE;

const KNOWN_OPERATOR_SCOPE_VALUES: readonly OperatorScope[] = [
  ADMIN_SCOPE,
  READ_SCOPE,
  WRITE_SCOPE,
  APPROVALS_SCOPE,
  PAIRING_SCOPE,
  TALK_SECRETS_SCOPE,
];

const KNOWN_OPERATOR_SCOPES: ReadonlySet<OperatorScope> = new Set(KNOWN_OPERATOR_SCOPE_VALUES);

/** Reused helper for is Operator Scope behavior in src/gateway. */
export function isOperatorScope(value: unknown): value is OperatorScope {
  return typeof value === "string" && KNOWN_OPERATOR_SCOPES.has(value as OperatorScope);
}
