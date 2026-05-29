// test/vitest vitest contracts channel session config helpers and runtime behavior.
import {
  channelSessionContractPatterns,
  createContractsVitestConfig,
} from "./vitest.contracts-shared.ts";

export default createContractsVitestConfig(
  channelSessionContractPatterns,
  process.env,
  process.argv,
  {
    name: "contracts-channel-session",
  },
);
