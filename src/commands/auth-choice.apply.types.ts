/** Shared types for auth choice application flows. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import type { AuthChoice, OnboardOptions } from "./onboard-types.js";

/** Shared type for Apply Auth Choice Params in src/commands. */
export type ApplyAuthChoiceParams = {
  authChoice: AuthChoice;
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  prompter: WizardPrompter;
  runtime: RuntimeEnv;
  agentDir?: string;
  setDefaultModel: boolean;
  preserveExistingDefaultModel?: boolean;
  agentId?: string;
  opts?: Partial<OnboardOptions>;
};

/** Shared type for Apply Auth Choice Result in src/commands. */
export type ApplyAuthChoiceResult = {
  config: OpenClawConfig;
  agentModelOverride?: string;
  retrySelection?: boolean;
};
