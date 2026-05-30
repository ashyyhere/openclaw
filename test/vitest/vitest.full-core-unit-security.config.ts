// Full core security Vitest config resolves its project list from the full-suite shard map.
import { createProjectShardVitestConfig } from "./vitest.project-shard-config.ts";
import { fullSuiteVitestShards } from "./vitest.test-shards.mjs";

/** Default full core unit security Vitest project-shard config. */
export default createProjectShardVitestConfig(
  fullSuiteVitestShards.find(
    (shard) => shard.config === "test/vitest/vitest.full-core-unit-security.config.ts",
  )?.projects ?? [],
);
