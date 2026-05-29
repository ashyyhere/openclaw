// Tests extensions/lmstudio plugin registration contract test behavior.
import { describePluginRegistrationContract } from "openclaw/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract({
  pluginId: "lmstudio",
  providerIds: ["lmstudio"],
});
