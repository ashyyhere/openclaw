// extensions/amazon-bedrock-mantle api helpers and runtime behavior.
/** Re-exported amazon-bedrock-mantle plugin public API. */
export {
  discoverMantleModels,
  generateBearerTokenFromIam,
  getCachedIamToken,
  MANTLE_IAM_TOKEN_MARKER,
  mergeImplicitMantleProvider,
  resetIamTokenCacheForTest,
  resetMantleDiscoveryCacheForTest,
  resolveImplicitMantleProvider,
  resolveMantleBearerToken,
  resolveMantleRuntimeBearerToken,
} from "./discovery.js";
