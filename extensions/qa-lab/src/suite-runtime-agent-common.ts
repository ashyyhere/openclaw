// QA Lab suite-runtime common helpers share live turn timeout selection.
import { resolveQaLiveTurnTimeoutMs } from "./live-timeout.js";
import type { QaProviderMode } from "./model-selection.js";

type QaLiveTimeoutEnv = {
  providerMode: QaProviderMode;
  primaryModel: string;
  alternateModel: string;
};

function liveTurnTimeoutMs(env: QaLiveTimeoutEnv, fallbackMs: number) {
  return resolveQaLiveTurnTimeoutMs(env, fallbackMs);
}

/** Resolves live turn timeout for QA suite agent helpers. */
export { liveTurnTimeoutMs };
