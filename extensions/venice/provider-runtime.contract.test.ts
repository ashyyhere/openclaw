// Tests extensions/venice provider runtime contract test behavior.
import { describeVeniceProviderRuntimeContract } from "openclaw/plugin-sdk/provider-test-contracts";

describeVeniceProviderRuntimeContract(() => import("./index.js"));
