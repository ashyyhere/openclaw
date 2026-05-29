// test/vitest vitest contracts channel surface config helpers and runtime behavior.
import {
  channelSurfaceContractPatterns,
  createContractsVitestConfig,
} from "./vitest.contracts-shared.ts";

export default createContractsVitestConfig(
  channelSurfaceContractPatterns,
  process.env,
  process.argv,
  {
    name: "contracts-channel-surface",
  },
);
