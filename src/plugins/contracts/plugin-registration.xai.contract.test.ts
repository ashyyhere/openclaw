// Tests plugins/contracts plugin registration xai contract test behavior.
import { pluginRegistrationContractCases } from "openclaw/plugin-sdk/plugin-test-contracts";
import { describePluginRegistrationContract } from "openclaw/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract(pluginRegistrationContractCases.xai);
