// Tests extensions/alibaba plugin registration contract test behavior.
import { describePluginRegistrationContract } from "openclaw/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract({
  pluginId: "alibaba",
  videoGenerationProviderIds: ["alibaba"],
  requireGenerateVideo: true,
});
