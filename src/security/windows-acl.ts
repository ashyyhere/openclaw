// security windows acl helpers and runtime behavior.
/** Re-exported API for src/security. */
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
