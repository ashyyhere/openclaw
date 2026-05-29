// Tests extensions/runway plugin registration contract test behavior.
import { describePluginRegistrationContract } from "openclaw/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract({
  pluginId: "runway",
  videoGenerationProviderIds: ["runway"],
  requireGenerateVideo: true,
});
