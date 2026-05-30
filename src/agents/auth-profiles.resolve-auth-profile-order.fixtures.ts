/** Fixtures for auth-profile ordering tests. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { AuthProfileStore } from "./auth-profiles.js";

/** Auth profile store fixture with default and work Anthropic profiles. */
export const ANTHROPIC_STORE: AuthProfileStore = {
  version: 1,
  profiles: {
    "anthropic:default": {
      type: "api_key",
      provider: "anthropic",
      key: "sk-default",
    },
    "anthropic:work": {
      type: "api_key",
      provider: "anthropic",
      key: "sk-work",
    },
  },
};

/** Config fixture referencing the Anthropic profiles by id. */
export const ANTHROPIC_CFG: OpenClawConfig = {
  auth: {
    profiles: {
      "anthropic:default": { provider: "anthropic", mode: "api_key" },
      "anthropic:work": { provider: "anthropic", mode: "api_key" },
    },
  },
};
