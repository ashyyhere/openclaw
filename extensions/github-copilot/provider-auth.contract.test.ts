// Tests extensions/github-copilot provider auth contract test behavior.
import { describeGithubCopilotProviderAuthContract } from "openclaw/plugin-sdk/provider-test-contracts";

describeGithubCopilotProviderAuthContract(() => import("./index.js"));
