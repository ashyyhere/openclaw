// Shared talk provider fixture values for speech config tests.
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Stable id for the fake speech provider used in tests. */
export const TALK_TEST_PROVIDER_ID = "acme-speech";
/** Display label for the fake speech provider used in tests. */
export const TALK_TEST_PROVIDER_LABEL = "Acme Speech";
/** Dot-path to the fake speech provider API key in OpenClaw config. */
export const TALK_TEST_PROVIDER_API_KEY_PATH = `talk.providers.${TALK_TEST_PROVIDER_ID}.apiKey`;
/** Path segments for the fake speech provider API key in OpenClaw config. */
export const TALK_TEST_PROVIDER_API_KEY_PATH_SEGMENTS = [
  "talk",
  "providers",
  TALK_TEST_PROVIDER_ID,
  "apiKey",
] as const;

/** Build config containing the fake speech provider API key value. */
export function buildTalkTestProviderConfig(apiKey: unknown): OpenClawConfig {
  return {
    talk: {
      providers: {
        [TALK_TEST_PROVIDER_ID]: {
          apiKey,
        },
      },
    },
  } as OpenClawConfig;
}

/** Read the fake speech provider API key from OpenClaw config. */
export function readTalkTestProviderApiKey(config: OpenClawConfig): unknown {
  return config.talk?.providers?.[TALK_TEST_PROVIDER_ID]?.apiKey;
}
