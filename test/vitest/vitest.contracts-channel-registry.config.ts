// test/vitest vitest contracts channel registry config helpers and runtime behavior.
import {
  channelRegistryContractPatterns,
  createContractsVitestConfig,
} from "./vitest.contracts-shared.ts";

export default createContractsVitestConfig(
  channelRegistryContractPatterns,
  process.env,
  process.argv,
  {
    name: "contracts-channel-registry",
  },
);
