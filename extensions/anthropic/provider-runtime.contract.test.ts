// Tests extensions/anthropic provider runtime contract test behavior.
import { describeAnthropicProviderRuntimeContract } from "openclaw/plugin-sdk/provider-test-contracts";

describeAnthropicProviderRuntimeContract(() => import("./index.js"));
