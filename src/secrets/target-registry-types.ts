// secrets target registry types helpers and runtime behavior.
/** Shared type for Secret Target Config File in src/secrets. */
export type SecretTargetConfigFile = "openclaw.json" | "auth-profiles.json"; // pragma: allowlist secret
/** Shared type for Secret Target Shape in src/secrets. */
export type SecretTargetShape = "secret_input" | "sibling_ref"; // pragma: allowlist secret
/** Shared type for Secret Target Expected in src/secrets. */
export type SecretTargetExpected = "string" | "string-or-object"; // pragma: allowlist secret
/** Shared type for Auth Profile Type in src/secrets. */
export type AuthProfileType = "api_key" | "token";

/** Shared type for Secret Target Registry Entry in src/secrets. */
export type SecretTargetRegistryEntry = {
  id: string;
  targetType: string;
  targetTypeAliases?: string[];
  configFile: SecretTargetConfigFile;
  pathPattern: string;
  refPathPattern?: string;
  secretShape: SecretTargetShape;
  expectedResolvedValue: SecretTargetExpected;
  includeInPlan: boolean;
  includeInConfigure: boolean;
  includeInAudit: boolean;
  providerIdPathSegmentIndex?: number;
  accountIdPathSegmentIndex?: number;
  authProfileType?: AuthProfileType;
  trackProviderShadowing?: boolean;
};

/** Shared type for Resolved Plan Target in src/secrets. */
export type ResolvedPlanTarget = {
  entry: SecretTargetRegistryEntry;
  pathSegments: string[];
  refPathSegments?: string[];
  providerId?: string;
  accountId?: string;
};

/** Shared type for Discovered Config Secret Target in src/secrets. */
export type DiscoveredConfigSecretTarget = {
  entry: SecretTargetRegistryEntry;
  path: string;
  pathSegments: string[];
  refPath?: string;
  refPathSegments?: string[];
  value: unknown;
  refValue?: unknown;
  providerId?: string;
  accountId?: string;
};
