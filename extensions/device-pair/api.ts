// extensions/device-pair api helpers and runtime behavior.
/** Re-exported device-pair plugin public API. */
export {
  approveDevicePairing,
  clearDeviceBootstrapTokens,
  issueDeviceBootstrapToken,
  PAIRING_SETUP_BOOTSTRAP_PROFILE,
  listDevicePairing,
  revokeDeviceBootstrapToken,
  type DeviceBootstrapProfile,
} from "openclaw/plugin-sdk/device-bootstrap";
/** Re-exported device-pair plugin public API, starting with define Plugin Entry. */
export { definePluginEntry, type OpenClawPluginApi } from "openclaw/plugin-sdk/plugin-entry";
/** Re-exported device-pair plugin public API. */
export {
  resolveGatewayBindUrl,
  resolveGatewayPort,
  resolveTailnetHostWithRunner,
} from "openclaw/plugin-sdk/core";
/** Re-exported device-pair plugin public API. */
export {
  resolvePreferredOpenClawTmpDir,
  runPluginCommandWithTimeout,
} from "openclaw/plugin-sdk/sandbox";
/** Re-exported device-pair plugin public API, starting with render Qr Png Base64. */
export { renderQrPngBase64, renderQrPngDataUrl, writeQrPngTempFile } from "./qr-image.js";
