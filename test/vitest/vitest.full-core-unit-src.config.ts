// Full core source Vitest config resolves source projects from the full-suite shard map.
import { createProjectShardVitestConfig } from "./vitest.project-shard-config.ts";
import { fullSuiteVitestShards } from "./vitest.test-shards.mjs";

/** Default full core unit source Vitest project-shard config. */
export default createProjectShardVitestConfig(
  fullSuiteVitestShards.find(
    (shard) => shard.config === "test/vitest/vitest.full-core-unit-src.config.ts",
  )?.projects ?? [],
);
