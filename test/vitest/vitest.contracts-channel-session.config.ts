// Vitest project config for channel session contract tests.
import {
  channelSessionContractPatterns,
  createContractsVitestConfig,
} from "./vitest.contracts-shared.ts";

/** Channel session contract Vitest project configuration. */
export default createContractsVitestConfig(
  channelSessionContractPatterns,
  process.env,
  process.argv,
  {
    name: "contracts-channel-session",
  },
);
