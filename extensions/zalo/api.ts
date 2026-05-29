// extensions/zalo api helpers and runtime behavior.
/** Re-exported zalo plugin public API, starting with zalo Plugin. */
export { zaloPlugin } from "./src/channel.js";
/** Re-exported zalo plugin public API. */
export {
  createZaloSetupWizardProxy,
  resolveZaloRuntimeGroupPolicy,
  zaloDmPolicy,
  zaloSetupAdapter,
  zaloSetupWizard,
} from "./setup-api.js";
