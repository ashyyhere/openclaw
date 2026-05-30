// Full-suite Vitest shard config for unit support projects.
import { createProjectShardVitestConfig } from "./vitest.project-shard-config.ts";
import { fullSuiteVitestShards } from "./vitest.test-shards.mjs";

/** Default full core unit-support shard Vitest configuration. */
export default createProjectShardVitestConfig(
  fullSuiteVitestShards.find(
    (shard) => shard.config === "test/vitest/vitest.full-core-unit-support.config.ts",
  )?.projects ?? [],
);
