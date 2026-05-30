// Vitest project config for channel surface contract tests.
import {
  channelSurfaceContractPatterns,
  createContractsVitestConfig,
} from "./vitest.contracts-shared.ts";

/** Channel surface contract Vitest project configuration. */
export default createContractsVitestConfig(
  channelSurfaceContractPatterns,
  process.env,
  process.argv,
  {
    name: "contracts-channel-surface",
  },
);
