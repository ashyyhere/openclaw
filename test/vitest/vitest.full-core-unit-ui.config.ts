// Vitest shard config for the full core unit UI project set.
import { createProjectShardVitestConfig } from "./vitest.project-shard-config.ts";
import { fullSuiteVitestShards } from "./vitest.test-shards.mjs";

/** Default full-core-unit-ui Vitest shard configuration. */
export default createProjectShardVitestConfig(
  fullSuiteVitestShards.find(
    (shard) => shard.config === "test/vitest/vitest.full-core-unit-ui.config.ts",
  )?.projects ?? [],
);
