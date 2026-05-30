// Operator scope constants used by gateway clients and route authorization.
/** Full operator access, including privileged gateway mutations. */
export const ADMIN_SCOPE = "operator.admin" as const;
/** Read-only operator access for status and inspection methods. */
export const READ_SCOPE = "operator.read" as const;
/** Write operator access for non-admin gateway mutations. */
export const WRITE_SCOPE = "operator.write" as const;
/** Approval runtime access for reading and resolving pending approvals. */
export const APPROVALS_SCOPE = "operator.approvals" as const;
/** Pairing access used during gateway client enrollment. */
export const PAIRING_SCOPE = "operator.pairing" as const;
/** Talk secret-management access for realtime voice setup. */
export const TALK_SECRETS_SCOPE = "operator.talk.secrets" as const;

/** Closed set of operator scopes accepted by the gateway. */
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

/** Narrow arbitrary values to a known operator scope string. */
export function isOperatorScope(value: unknown): value is OperatorScope {
  return typeof value === "string" && KNOWN_OPERATOR_SCOPES.has(value as OperatorScope);
}
