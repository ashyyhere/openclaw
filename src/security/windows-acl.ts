// Security-audit barrel for Windows ACL inspection and repair command helpers.
/** Re-export Windows ACL helpers from the shared permissions implementation. */
export {
  createIcaclsResetCommand,
  formatIcaclsResetCommand,
  formatWindowsAclSummary,
  inspectWindowsAcl,
  parseIcaclsOutput,
  resolveWindowsUserPrincipal,
  summarizeWindowsAcl,
  type ExecFn,
  type WindowsAclEntry,
  type WindowsAclSummary,
} from "../infra/permissions.js";
