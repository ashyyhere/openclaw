/** Types for registry entries that locate secret-bearing config fields. */
/** Config files that can contain registered secret targets. */
export type SecretTargetConfigFile = "openclaw.json" | "auth-profiles.json"; // pragma: allowlist secret
/** Storage shape expected for a registered secret target. */
export type SecretTargetShape = "secret_input" | "sibling_ref"; // pragma: allowlist secret
/** Runtime value shape required after secret resolution. */
export type SecretTargetExpected = "string" | "string-or-object"; // pragma: allowlist secret
/** Auth profile credential kinds tracked by secret target discovery. */
export type AuthProfileType = "api_key" | "token";

/** Static registry entry describing one secret-bearing config path pattern. */
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

/** Registry target resolved to concrete config path segments for planning. */
export type ResolvedPlanTarget = {
  entry: SecretTargetRegistryEntry;
  pathSegments: string[];
  refPathSegments?: string[];
  providerId?: string;
  accountId?: string;
};

/** Concrete config value discovered from a registry target during audit/configure. */
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
