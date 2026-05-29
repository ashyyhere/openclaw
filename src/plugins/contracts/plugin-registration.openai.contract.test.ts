// Tests plugins/contracts plugin registration openai contract test behavior.
import { pluginRegistrationContractCases } from "openclaw/plugin-sdk/plugin-test-contracts";
import { describePluginRegistrationContract } from "openclaw/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract(pluginRegistrationContractCases.openai);
