// test-utils talk test provider helpers and runtime behavior.
import type { OpenClawConfig } from "../config/types.openclaw.js";

/** Reused constant for TALK TEST PROVIDER ID behavior in src/test-utils. */
export const TALK_TEST_PROVIDER_ID = "acme-speech";
/** Reused constant for TALK TEST PROVIDER LABEL behavior in src/test-utils. */
export const TALK_TEST_PROVIDER_LABEL = "Acme Speech";
/** Reused constant for TALK TEST PROVIDER API KEY PATH behavior in src/test-utils. */
export const TALK_TEST_PROVIDER_API_KEY_PATH = `talk.providers.${TALK_TEST_PROVIDER_ID}.apiKey`;
/** Reused constant for TALK TEST PROVIDER API KEY PATH SEGMENTS behavior in src/test-utils. */
export const TALK_TEST_PROVIDER_API_KEY_PATH_SEGMENTS = [
  "talk",
  "providers",
  TALK_TEST_PROVIDER_ID,
  "apiKey",
] as const;

/** Reused helper for build Talk Test Provider Config behavior in src/test-utils. */
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

/** Reused helper for read Talk Test Provider Api Key behavior in src/test-utils. */
export function readTalkTestProviderApiKey(config: OpenClawConfig): unknown {
  return config.talk?.providers?.[TALK_TEST_PROVIDER_ID]?.apiKey;
}
