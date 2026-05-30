// QA Lab live-timeout helper delegates provider/model-specific turn timeout selection.
import type { QaProviderMode } from "./model-selection.js";
import { getQaProvider } from "./providers/index.js";

type QaLiveTimeoutProfile = {
  providerMode: QaProviderMode;
  primaryModel: string;
  alternateModel: string;
};

/** Resolves the live turn timeout for the selected provider profile and model. */
export function resolveQaLiveTurnTimeoutMs(
  profile: QaLiveTimeoutProfile,
  fallbackMs: number,
  modelRef = profile.primaryModel,
) {
  return getQaProvider(profile.providerMode).resolveTurnTimeoutMs({
    primaryModel: profile.primaryModel,
    alternateModel: profile.alternateModel,
    modelRef,
    fallbackMs,
  });
}
