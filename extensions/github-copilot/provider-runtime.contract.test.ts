// Tests extensions/github-copilot provider runtime contract test behavior.
import { describeGithubCopilotProviderRuntimeContract } from "openclaw/plugin-sdk/provider-test-contracts";

describeGithubCopilotProviderRuntimeContract(() => import("./index.js"));
