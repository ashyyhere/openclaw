// plugins doctor session route state owner types helpers and runtime behavior.
/** Shared type for Doctor Session Route State Owner in src/plugins. */
export type DoctorSessionRouteStateOwner = {
  id: string;
  label: string;
  providerIds?: readonly string[];
  runtimeIds?: readonly string[];
  cliSessionKeys?: readonly string[];
  authProfilePrefixes?: readonly string[];
};
