// extensions/nvidia api helpers and runtime behavior.
/** Re-exported nvidia plugin public API, starting with build Nvidia Provider. */
export { buildNvidiaProvider, NVIDIA_DEFAULT_MODEL_ID } from "./provider-catalog.js";
/** Re-exported nvidia plugin public API. */
export {
  applyNvidiaConfig,
  applyNvidiaProviderConfig,
  NVIDIA_DEFAULT_MODEL_REF,
} from "./onboard.js";
