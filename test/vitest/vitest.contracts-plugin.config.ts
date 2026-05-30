// Plugin contracts Vitest config runs shared plugin contract patterns.
import { createContractsVitestConfig, pluginContractPatterns } from "./vitest.contracts-shared.ts";

/** Default plugin contract Vitest project config. */
export default createContractsVitestConfig(pluginContractPatterns, process.env, process.argv, {
  name: "contracts-plugin",
});
