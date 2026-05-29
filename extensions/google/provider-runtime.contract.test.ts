// Tests extensions/google provider runtime contract test behavior.
import { describeGoogleProviderRuntimeContract } from "openclaw/plugin-sdk/provider-test-contracts";

describeGoogleProviderRuntimeContract(() => import("./index.js"));
