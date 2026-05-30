// QA Lab model-selection helpers normalize provider mode and model references.
import {
  DEFAULT_QA_LIVE_PROVIDER_MODE,
  getQaProvider,
  type QaProviderModeInput,
} from "./providers/index.js";

/** QA provider mode types shared by CLI options and suite runtime selection. */
export type { QaProviderMode, QaProviderModeInput } from "./providers/index.js";

/** Primary and alternate model refs used by parity and fast-mode checks. */
export type QaModelSelection = {
  primaryModel: string;
  alternateModel: string;
};

/** Provider-mode normalizer re-exported for QA Lab commands. */
export { normalizeQaProviderMode } from "./providers/index.js";

/** Returns the default model for a QA provider mode and optional alternate lane. */
export function defaultQaModelForMode(
  mode: QaProviderModeInput,
  options?: {
    alternate?: boolean;
    preferredLiveModel?: string;
  },
) {
  return getQaProvider(mode).defaultModel(options);
}

/** Splits `provider/model` refs into provider and model parts, or null for bare refs. */
export function splitQaModelRef(ref: string) {
  const slash = ref.indexOf("/");
  if (slash <= 0 || slash === ref.length - 1) {
    return null;
  }
  return {
    provider: ref.slice(0, slash),
    model: ref.slice(slash + 1),
  };
}

/** Checks whether a model ref uses the default live provider's fast-mode behavior. */
export function isQaFastModeModelRef(ref: string) {
  return getQaProvider(DEFAULT_QA_LIVE_PROVIDER_MODE).usesFastModeByDefault(ref);
}

/** Checks whether either selected model enables fast-mode runtime behavior. */
export function isQaFastModeEnabled(selection: QaModelSelection) {
  return (
    isQaFastModeModelRef(selection.primaryModel) || isQaFastModeModelRef(selection.alternateModel)
  );
}
