// Vitest project config for gateway server-method tests.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

/** Create the gateway-methods Vitest project config. */
export function createGatewayMethodsVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/gateway/server-methods/**/*.test.ts"], {
    dir: "src/gateway",
    env,
    name: "gateway-methods",
  });
}

/** Default gateway-methods Vitest project configuration. */
export default createGatewayMethodsVitestConfig();
