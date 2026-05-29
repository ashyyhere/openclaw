/** Config fixture helpers for model fallback tests. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";

/** Creates an OpenClaw config with model fallback defaults. */
export function makeModelFallbackCfg(overrides: Partial<OpenClawConfig> = {}): OpenClawConfig {
  return {
    agents: {
      defaults: {
        model: {
          primary: "openai/gpt-4.1-mini",
          fallbacks: ["anthropic/claude-haiku-3-5"],
        },
      },
    },
    ...overrides,
  } as OpenClawConfig;
}
