// Security-audit barrel for filesystem permission checks.
/** Re-export filesystem permission helpers from the shared permissions implementation. */
export {
  formatPermissionDetail,
  formatPermissionRemediation,
  inspectPathPermissions,
  safeStat,
  type PermissionCheck,
  type PermissionCheckOptions,
} from "../infra/permissions.js";
