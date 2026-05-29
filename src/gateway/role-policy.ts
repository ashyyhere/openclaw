// gateway role policy helpers and runtime behavior.
import { isNodeRoleMethod } from "./method-scopes.js";

const GATEWAY_ROLES = ["operator", "node"] as const;

/** Shared type for Gateway Role in src/gateway. */
export type GatewayRole = (typeof GATEWAY_ROLES)[number];

/** Reused helper for parse Gateway Role behavior in src/gateway. */
export function parseGatewayRole(roleRaw: unknown): GatewayRole | null {
  if (roleRaw === "operator" || roleRaw === "node") {
    return roleRaw;
  }
  return null;
}

/** Reused helper for role Can Skip Device Identity behavior in src/gateway. */
export function roleCanSkipDeviceIdentity(role: GatewayRole, sharedAuthOk: boolean): boolean {
  return role === "operator" && sharedAuthOk;
}

/** Reused helper for is Role Authorized For Method behavior in src/gateway. */
export function isRoleAuthorizedForMethod(role: GatewayRole, method: string): boolean {
  if (isNodeRoleMethod(method)) {
    return role === "node";
  }
  return role === "operator";
}
