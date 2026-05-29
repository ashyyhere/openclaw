// Tests extensions/minimax provider discovery contract test behavior.
import { describeMinimaxProviderDiscoveryContract } from "openclaw/plugin-sdk/provider-test-contracts";

describeMinimaxProviderDiscoveryContract(() => import("./index.js"));
