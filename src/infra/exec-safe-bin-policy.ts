// Public facade for safe-bin profiles and validation used by exec approval policy.
/** Safe-bin profile definitions and documentation renderers. */
export {
  DEFAULT_SAFE_BINS,
  SAFE_BIN_PROFILE_FIXTURES,
  SAFE_BIN_PROFILES,
  buildLongFlagPrefixMap,
  collectKnownLongFlags,
  normalizeSafeBinProfileFixtures,
  renderDefaultSafeBinsDocText,
  renderSafeBinDeniedFlagsDocBullets,
  resolveSafeBinProfiles,
  type SafeBinProfile,
  type SafeBinProfileFixture,
  type SafeBinProfileFixtures,
} from "./exec-safe-bin-policy-profiles.js";

/** Safe-bin argv validator used before approved host command execution. */
export { validateSafeBinArgv } from "./exec-safe-bin-policy-validator.js";
