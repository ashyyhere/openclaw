// Full-suite Vitest shard config for bundled-plugin core projects.
import { createProjectShardVitestConfig } from "./vitest.project-shard-config.ts";
import { fullSuiteVitestShards } from "./vitest.test-shards.mjs";

/** Default full core bundled shard Vitest configuration. */
export default createProjectShardVitestConfig(
  fullSuiteVitestShards.find(
    (shard) => shard.config === "test/vitest/vitest.full-core-bundled.config.ts",
  )?.projects ?? [],
);
