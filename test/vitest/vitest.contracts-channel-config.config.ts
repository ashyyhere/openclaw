// test/vitest vitest contracts channel config config helpers and runtime behavior.
import {
  channelConfigContractPatterns,
  createContractsVitestConfig,
} from "./vitest.contracts-shared.ts";

export default createContractsVitestConfig(
  channelConfigContractPatterns,
  process.env,
  process.argv,
  {
    name: "contracts-channel-config",
  },
);
