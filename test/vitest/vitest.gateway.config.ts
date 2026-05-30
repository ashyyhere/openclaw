// Gateway Vitest config either runs the fallback gateway shard or fans out to project shards.
import { createProjectShardVitestConfig } from "./vitest.project-shard-config.ts";
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

const gatewayProjectConfigs = [
  "test/vitest/vitest.gateway-core.config.ts",
  "test/vitest/vitest.gateway-client.config.ts",
  "test/vitest/vitest.gateway-methods.config.ts",
  "test/vitest/vitest.gateway-server.config.ts",
] as const;

/** Creates the non-sharded gateway Vitest project config. */
export function createGatewayVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/gateway/**/*.test.ts"], {
    dir: "src/gateway",
    env,
    exclude: [
      "src/gateway/gateway.test.ts",
      "src/gateway/server.startup-matrix-migration.integration.test.ts",
      "src/gateway/sessions-history-http.test.ts",
    ],
    name: "gateway",
  });
}

/** Creates the gateway project-shard aggregate config. */
export function createGatewayProjectShardVitestConfig() {
  return createProjectShardVitestConfig(gatewayProjectConfigs);
}

/** Default gateway Vitest config, selected by the project-shard env toggle. */
export default process.env.OPENCLAW_GATEWAY_PROJECT_SHARDS === "1"
  ? createGatewayProjectShardVitestConfig()
  : createGatewayVitestConfig();
