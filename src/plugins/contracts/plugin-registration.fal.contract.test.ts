// Tests plugins/contracts plugin registration fal contract test behavior.
import { pluginRegistrationContractCases } from "openclaw/plugin-sdk/plugin-test-contracts";
import { describePluginRegistrationContract } from "openclaw/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract(pluginRegistrationContractCases.fal);
