// Tests plugins/contracts tts contract test behavior.
import {
  describeTtsAutoApplyContract,
  describeTtsConfigContract,
  describeTtsProviderRuntimeContract,
  describeTtsSummarizationContract,
} from "./tts-contract-suites.js";

describeTtsAutoApplyContract();
describeTtsConfigContract();
describeTtsProviderRuntimeContract();
describeTtsSummarizationContract();
