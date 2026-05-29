// test/vitest vitest full core unit config helpers and runtime behavior.
import { createProjectShardVitestConfig } from "./vitest.project-shard-config.ts";
import { fullSuiteVitestShards } from "./vitest.test-shards.mjs";

export default createProjectShardVitestConfig(fullSuiteVitestShards[0].projects);
