// Shared bootstrap/pairing helpers for plugins that provision remote devices.

/** Re-exported API for src/plugin-sdk, starting with approve Device Pairing. */
export { approveDevicePairing, listDevicePairing } from "../infra/device-pairing.js";
/** Re-exported API for src/plugin-sdk. */
export {
  clearDeviceBootstrapTokens,
  issueDeviceBootstrapToken,
  revokeDeviceBootstrapToken,
} from "../infra/device-bootstrap.js";
/** Re-exported API for src/plugin-sdk. */
export {
  normalizeDeviceBootstrapProfile,
  PAIRING_SETUP_BOOTSTRAP_PROFILE,
  type DeviceBootstrapProfile,
  type DeviceBootstrapProfileInput,
} from "../shared/device-bootstrap-profile.js";
