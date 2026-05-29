// Tests extensions/zai provider runtime contract test behavior.
import { describeZAIProviderRuntimeContract } from "openclaw/plugin-sdk/provider-test-contracts";

describeZAIProviderRuntimeContract(() => import("./index.js"));
