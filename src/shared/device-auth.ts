// shared device auth helpers and runtime behavior.
/** Shared type for Device Auth Entry in src/shared. */
export type DeviceAuthEntry = {
  token: string;
  role: string;
  scopes: string[];
  updatedAtMs: number;
};

/** Shared type for Device Auth Store in src/shared. */
export type DeviceAuthStore = {
  version: 1;
  deviceId: string;
  tokens: Record<string, DeviceAuthEntry>;
};

/** Reused helper for normalize Device Auth Role behavior in src/shared. */
export function normalizeDeviceAuthRole(role: string): string {
  return role.trim();
}

/** Reused helper for normalize Device Auth Scopes behavior in src/shared. */
export function normalizeDeviceAuthScopes(scopes: readonly unknown[] | undefined): string[] {
  if (!Array.isArray(scopes)) {
    return [];
  }
  const out = new Set<string>();
  for (const scope of scopes) {
    if (typeof scope !== "string") {
      continue;
    }
    const trimmed = scope.trim();
    if (trimmed) {
      out.add(trimmed);
    }
  }
  if (out.has("operator.admin")) {
    out.add("operator.read");
    out.add("operator.write");
  } else if (out.has("operator.write")) {
    out.add("operator.read");
  }
  return [...out].toSorted();
}
