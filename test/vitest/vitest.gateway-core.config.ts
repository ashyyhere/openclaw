// Vitest project config for focused gateway core tests, excluding broader gateway lanes.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

const nonCoreGatewayTestExclude = [
  "src/gateway/server-methods/**/*.test.ts",
  "packages/gateway-protocol/src/**/*.test.ts",
  "src/gateway/**/*client*.test.ts",
  "src/gateway/**/*reconnect*.test.ts",
  "src/gateway/**/*android-node*.test.ts",
  "src/gateway/**/*gateway-cli-backend*.test.ts",
  "src/gateway/**/*server*.test.ts",
  "src/gateway/gateway.test.ts",
  "src/gateway/embeddings-http.test.ts",
  "src/gateway/models-http.test.ts",
  "src/gateway/openai-http.test.ts",
  "src/gateway/openresponses-http.test.ts",
  "src/gateway/probe.auth.integration.test.ts",
  "src/gateway/server.startup-matrix-migration.integration.test.ts",
  "src/gateway/sessions-history-http.test.ts",
];

/** Create the gateway-core Vitest project config with non-core gateway tests excluded. */
export function createGatewayCoreVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/gateway/**/*.test.ts"], {
    dir: "src/gateway",
    env,
    exclude: nonCoreGatewayTestExclude,
    name: "gateway-core",
  });
}

/** Default gateway-core Vitest project configuration. */
export default createGatewayCoreVitestConfig();
