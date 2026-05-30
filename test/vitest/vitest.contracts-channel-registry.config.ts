// Vitest project config for channel registry contract tests.
import {
  channelRegistryContractPatterns,
  createContractsVitestConfig,
} from "./vitest.contracts-shared.ts";

/** Default channel registry contract Vitest project configuration. */
export default createContractsVitestConfig(
  channelRegistryContractPatterns,
  process.env,
  process.argv,
  {
    name: "contracts-channel-registry",
  },
);
