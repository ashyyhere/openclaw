// Tests extensions/qwen provider discovery contract test behavior.
import { describeModelStudioProviderDiscoveryContract } from "openclaw/plugin-sdk/provider-test-contracts";

describeModelStudioProviderDiscoveryContract(() => import("./index.js"));
