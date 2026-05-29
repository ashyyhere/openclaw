// Tests plugins/contracts plugin registration exa contract test behavior.
import { pluginRegistrationContractCases } from "openclaw/plugin-sdk/plugin-test-contracts";
import { describePluginRegistrationContract } from "openclaw/plugin-sdk/plugin-test-contracts";

describePluginRegistrationContract(pluginRegistrationContractCases.exa);
