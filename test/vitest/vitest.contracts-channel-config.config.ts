// Vitest project config for channel config contract tests.
import {
  channelConfigContractPatterns,
  createContractsVitestConfig,
} from "./vitest.contracts-shared.ts";

/** Default channel config contract Vitest project configuration. */
export default createContractsVitestConfig(
  channelConfigContractPatterns,
  process.env,
  process.argv,
  {
    name: "contracts-channel-config",
  },
);
