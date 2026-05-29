// shared device bootstrap profile helpers and runtime behavior.
import { normalizeDeviceAuthRole, normalizeDeviceAuthScopes } from "./device-auth.js";

/** Shared type for Device Bootstrap Profile in src/shared. */
export type DeviceBootstrapProfile = {
  roles: string[];
  scopes: string[];
};

/** Shared type for Device Bootstrap Profile Input in src/shared. */
export type DeviceBootstrapProfileInput = {
  roles?: readonly string[];
  scopes?: readonly string[];
};

/** Reused constant for BOOTSTRAP HANDOFF OPERATOR SCOPES behavior in src/shared. */
export const BOOTSTRAP_HANDOFF_OPERATOR_SCOPES = [
  "operator.approvals",
  "operator.read",
  "operator.talk.secrets",
  "operator.write",
] as const;

const BOOTSTRAP_HANDOFF_OPERATOR_SCOPE_SET = new Set<string>(BOOTSTRAP_HANDOFF_OPERATOR_SCOPES);

/** Reused constant for PAIRING SETUP BOOTSTRAP PROFILE behavior in src/shared. */
export const PAIRING_SETUP_BOOTSTRAP_PROFILE: DeviceBootstrapProfile = {
  // QR/setup-code bootstrap must hand off both tokens for native onboarding:
  // iOS/Android suppress the operator loop while bootstrap auth is active and
  // only start it after persisting this bounded operator token.
  roles: ["node", "operator"],
  scopes: [...BOOTSTRAP_HANDOFF_OPERATOR_SCOPES],
};

/** Reused helper for is Pairing Setup Bootstrap Profile behavior in src/shared. */
export function isPairingSetupBootstrapProfile(
  input: DeviceBootstrapProfileInput | undefined,
): boolean {
  const profile = normalizeDeviceBootstrapProfile(input);
  if (profile.roles.length !== PAIRING_SETUP_BOOTSTRAP_PROFILE.roles.length) {
    return false;
  }
  if (profile.scopes.length !== PAIRING_SETUP_BOOTSTRAP_PROFILE.scopes.length) {
    return false;
  }
  return (
    profile.roles.every((role, index) => role === PAIRING_SETUP_BOOTSTRAP_PROFILE.roles[index]) &&
    profile.scopes.every((scope, index) => scope === PAIRING_SETUP_BOOTSTRAP_PROFILE.scopes[index])
  );
}

/** Reused helper for resolve Bootstrap Profile Scopes For Role behavior in src/shared. */
export function resolveBootstrapProfileScopesForRole(
  role: string,
  scopes: readonly string[],
): string[] {
  const normalizedRole = normalizeDeviceAuthRole(role);
  const normalizedScopes = normalizeDeviceAuthScopes(Array.from(scopes));
  if (normalizedRole === "operator") {
    return normalizedScopes.filter((scope) => BOOTSTRAP_HANDOFF_OPERATOR_SCOPE_SET.has(scope));
  }
  return [];
}

/** Reused helper for resolve Bootstrap Profile Scopes For Roles behavior in src/shared. */
export function resolveBootstrapProfileScopesForRoles(
  roles: readonly string[],
  scopes: readonly string[],
): string[] {
  return normalizeDeviceAuthScopes(
    roles.flatMap((role) => resolveBootstrapProfileScopesForRole(role, scopes)),
  );
}

/** Reused helper for normalize Device Bootstrap Handoff Profile behavior in src/shared. */
export function normalizeDeviceBootstrapHandoffProfile(
  input: DeviceBootstrapProfileInput | undefined,
): DeviceBootstrapProfile {
  const profile = normalizeDeviceBootstrapProfile(input);
  // Bootstrap handoff profiles can only carry the documented handoff allowlist.
  return {
    roles: profile.roles,
    scopes: resolveBootstrapProfileScopesForRoles(profile.roles, profile.scopes),
  };
}

function normalizeBootstrapRoles(roles: readonly string[] | undefined): string[] {
  if (!Array.isArray(roles)) {
    return [];
  }
  const out = new Set<string>();
  for (const role of roles) {
    const normalized = normalizeDeviceAuthRole(role);
    if (normalized) {
      out.add(normalized);
    }
  }
  return [...out].toSorted();
}

/** Reused helper for normalize Device Bootstrap Profile behavior in src/shared. */
export function normalizeDeviceBootstrapProfile(
  input: DeviceBootstrapProfileInput | undefined,
): DeviceBootstrapProfile {
  return {
    roles: normalizeBootstrapRoles(input?.roles),
    scopes: normalizeDeviceAuthScopes(input?.scopes ? [...input.scopes] : []),
  };
}
