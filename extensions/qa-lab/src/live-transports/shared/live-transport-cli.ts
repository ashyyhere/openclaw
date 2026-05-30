// QA Lab live-transport CLI helpers apply shared provider-mode defaults to lanes.
import {
  createLiveTransportQaCliRegistration as createSharedLiveTransportQaCliRegistration,
  type LiveTransportQaCliRegistrationOptions,
} from "openclaw/plugin-sdk/qa-runtime";
import { DEFAULT_QA_LIVE_PROVIDER_MODE, formatQaProviderModeHelp } from "../../providers/index.js";

/** QA runtime CLI helpers re-exported for channel-specific live transport commands. */
export {
  createLazyCliRuntimeLoader,
  type LiveTransportQaCliRegistration,
  type LiveTransportQaCommandOptions,
} from "openclaw/plugin-sdk/qa-runtime";

type QaLabLiveTransportQaCliRegistrationOptions = Omit<
  LiveTransportQaCliRegistrationOptions,
  "allowFailuresHelp" | "defaultProviderMode" | "providerModeHelp"
>;

/** Creates a live-transport QA command registration with QA Lab provider defaults. */
export function createLiveTransportQaCliRegistration(
  params: QaLabLiveTransportQaCliRegistrationOptions,
) {
  return createSharedLiveTransportQaCliRegistration({
    ...params,
    allowFailuresHelp: "Write artifacts without setting a failing exit code when scenarios fail",
    defaultProviderMode: DEFAULT_QA_LIVE_PROVIDER_MODE,
    providerModeHelp: formatQaProviderModeHelp(),
  });
}
