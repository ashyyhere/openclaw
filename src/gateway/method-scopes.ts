// gateway method scopes helpers and runtime behavior.
import { getPluginRegistryState } from "../plugins/runtime-state.js";
import { resolveReservedGatewayMethodScope } from "../shared/gateway-method-policy.js";
import { normalizeOptionalString as normalizeSessionActionParam } from "../shared/string-coerce.js";
import {
  isCoreGatewayMethodClassified,
  isCoreNodeGatewayMethod,
  isDynamicOperatorGatewayMethod,
  resolveCoreOperatorGatewayMethodScope,
} from "./methods/core-descriptors.js";
import {
  ADMIN_SCOPE,
  APPROVALS_SCOPE,
  PAIRING_SCOPE,
  READ_SCOPE,
  TALK_SECRETS_SCOPE,
  WRITE_SCOPE,
  isOperatorScope,
  type OperatorScope,
} from "./operator-scopes.js";

/** Re-exported API for src/gateway. */
export {
  ADMIN_SCOPE,
  APPROVALS_SCOPE,
  PAIRING_SCOPE,
  READ_SCOPE,
  TALK_SECRETS_SCOPE,
  WRITE_SCOPE,
  type OperatorScope,
};

/** Reused constant for CLI DEFAULT OPERATOR SCOPES behavior in src/gateway. */
export const CLI_DEFAULT_OPERATOR_SCOPES: OperatorScope[] = [
  ADMIN_SCOPE,
  READ_SCOPE,
  WRITE_SCOPE,
  APPROVALS_SCOPE,
  PAIRING_SCOPE,
  TALK_SECRETS_SCOPE,
];

function resolveScopedMethod(method: string): OperatorScope | undefined {
  const explicitScope = resolveCoreOperatorGatewayMethodScope(method);
  if (explicitScope) {
    return explicitScope;
  }
  const reservedScope = resolveReservedGatewayMethodScope(method);
  if (reservedScope) {
    return reservedScope;
  }
  const pluginDescriptor = getPluginRegistryState()?.activeRegistry?.gatewayMethodDescriptors?.find(
    (descriptor) => descriptor.name === method,
  );
  const pluginScope = pluginDescriptor?.scope;
  return pluginScope === "node" || pluginScope === "dynamic" ? undefined : pluginScope;
}

/** Reused helper for is Approval Method behavior in src/gateway. */
export function isApprovalMethod(method: string): boolean {
  return resolveScopedMethod(method) === APPROVALS_SCOPE;
}

/** Reused helper for is Pairing Method behavior in src/gateway. */
export function isPairingMethod(method: string): boolean {
  return resolveScopedMethod(method) === PAIRING_SCOPE;
}

/** Reused helper for is Read Method behavior in src/gateway. */
export function isReadMethod(method: string): boolean {
  return resolveScopedMethod(method) === READ_SCOPE;
}

/** Reused helper for is Write Method behavior in src/gateway. */
export function isWriteMethod(method: string): boolean {
  return resolveScopedMethod(method) === WRITE_SCOPE;
}

/** Reused helper for is Node Role Method behavior in src/gateway. */
export function isNodeRoleMethod(method: string): boolean {
  return isCoreNodeGatewayMethod(method);
}

/** Reused helper for is Admin Only Method behavior in src/gateway. */
export function isAdminOnlyMethod(method: string): boolean {
  return resolveScopedMethod(method) === ADMIN_SCOPE;
}

/** Reused helper for resolve Required Operator Scope For Method behavior in src/gateway. */
export function resolveRequiredOperatorScopeForMethod(method: string): OperatorScope | undefined {
  return resolveScopedMethod(method);
}

function resolveSessionActionRegisteredScopes(params: unknown): OperatorScope[] | undefined {
  if (!params || typeof params !== "object" || Array.isArray(params)) {
    return undefined;
  }
  const pluginId = normalizeSessionActionParam((params as { pluginId?: unknown }).pluginId);
  const actionId = normalizeSessionActionParam((params as { actionId?: unknown }).actionId);
  if (!pluginId || !actionId) {
    return undefined;
  }
  const registration = getPluginRegistryState()?.activeRegistry?.sessionActions?.find(
    (entry) => entry.pluginId === pluginId && entry.action.id === actionId,
  );
  if (!registration) {
    return undefined;
  }
  const requiredScopes = registration.action.requiredScopes;
  return requiredScopes && requiredScopes.length > 0 ? [...requiredScopes] : [WRITE_SCOPE];
}

function resolveSessionActionLeastPrivilegeScopes(params: unknown): OperatorScope[] {
  const registeredScopes = resolveSessionActionRegisteredScopes(params);
  if (registeredScopes) {
    return registeredScopes;
  }
  if (params && typeof params === "object" && !Array.isArray(params)) {
    const pluginId = normalizeSessionActionParam((params as { pluginId?: unknown }).pluginId);
    const actionId = normalizeSessionActionParam((params as { actionId?: unknown }).actionId);
    if (pluginId && actionId) {
      // A standalone CLI/tool caller may be talking to a gateway whose live
      // plugin registry is not present in this local process. Avoid under-scoping
      // valid dynamic actions when we cannot determine the exact requirement
      // locally.
      return [...CLI_DEFAULT_OPERATOR_SCOPES];
    }
  }
  return [WRITE_SCOPE];
}

function resolveDynamicLeastPrivilegeOperatorScopesForMethod(
  method: string,
  params: unknown,
): OperatorScope[] {
  if (method === "plugins.sessionAction") {
    return resolveSessionActionLeastPrivilegeScopes(params);
  }
  return [WRITE_SCOPE];
}

/** Reused helper for resolve Least Privilege Operator Scopes For Method behavior in src/gateway. */
export function resolveLeastPrivilegeOperatorScopesForMethod(
  method: string,
  params?: unknown,
): OperatorScope[] {
  if (isDynamicOperatorGatewayMethod(method)) {
    return resolveDynamicLeastPrivilegeOperatorScopesForMethod(method, params);
  }
  const requiredScope = resolveRequiredOperatorScopeForMethod(method);
  if (requiredScope) {
    return [requiredScope];
  }
  // Default-deny for unclassified methods.
  return [];
}

/** Reused helper for authorize Operator Scopes For Method behavior in src/gateway. */
export function authorizeOperatorScopesForMethod(
  method: string,
  scopes: readonly string[],
  params?: unknown,
): { allowed: true } | { allowed: false; missingScope: OperatorScope } {
  if (scopes.includes(ADMIN_SCOPE)) {
    return { allowed: true };
  }
  if (isDynamicOperatorGatewayMethod(method)) {
    const registeredScopes = resolveSessionActionRegisteredScopes(params);
    if (!registeredScopes && params && typeof params === "object" && !Array.isArray(params)) {
      const pluginId = normalizeSessionActionParam((params as { pluginId?: unknown }).pluginId);
      const actionId = normalizeSessionActionParam((params as { actionId?: unknown }).actionId);
      if (!pluginId || !actionId) {
        return scopes.some((scope) => isOperatorScope(scope))
          ? { allowed: true }
          : { allowed: false, missingScope: WRITE_SCOPE };
      }
    }
    const requiredScopes = registeredScopes ?? [WRITE_SCOPE];
    const missingScope = requiredScopes.find((scope) => {
      return !scopes.includes(scope) && !(scope === READ_SCOPE && scopes.includes(WRITE_SCOPE));
    });
    return missingScope ? { allowed: false, missingScope } : { allowed: true };
  }
  const requiredScope = resolveRequiredOperatorScopeForMethod(method) ?? ADMIN_SCOPE;
  if (requiredScope === READ_SCOPE) {
    if (scopes.includes(READ_SCOPE) || scopes.includes(WRITE_SCOPE)) {
      return { allowed: true };
    }
    return { allowed: false, missingScope: READ_SCOPE };
  }
  if (scopes.includes(requiredScope)) {
    return { allowed: true };
  }
  return { allowed: false, missingScope: requiredScope };
}

/** Reused helper for is Gateway Method Classified behavior in src/gateway. */
export function isGatewayMethodClassified(method: string): boolean {
  if (isNodeRoleMethod(method)) {
    return true;
  }
  if (isDynamicOperatorGatewayMethod(method)) {
    return true;
  }
  return (
    isCoreGatewayMethodClassified(method) ||
    resolveRequiredOperatorScopeForMethod(method) !== undefined
  );
}
