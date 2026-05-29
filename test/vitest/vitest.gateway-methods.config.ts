// test/vitest vitest gateway methods config helpers and runtime behavior.
import { createScopedVitestConfig } from "./vitest.scoped-config.ts";

export function createGatewayMethodsVitestConfig(env?: Record<string, string | undefined>) {
  return createScopedVitestConfig(["src/gateway/server-methods/**/*.test.ts"], {
    dir: "src/gateway",
    env,
    name: "gateway-methods",
  });
}

export default createGatewayMethodsVitestConfig();
