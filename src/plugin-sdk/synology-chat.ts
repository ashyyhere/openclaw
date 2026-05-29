// Manual facade. Keep loader boundary explicit.
import type { SecurityAuditFinding } from "../security/audit.types.js";
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader.js";

type FacadeModule = {
  collectSynologyChatSecurityAuditFindings: (params: {
    accountId?: string | null;
    account: {
      accountId?: string;
      dangerouslyAllowNameMatching?: boolean;
    };
    orderedAccountIds: string[];
    hasExplicitAccountPath: boolean;
  }) => SecurityAuditFinding[];
};

function loadFacadeModule(): FacadeModule {
  return loadBundledPluginPublicSurfaceModuleSync<FacadeModule>({
    dirName: "synology-chat",
    artifactBasename: "contract-api.js",
  });
}

/** Reused constant for collect Synology Chat Security Audit Findings behavior in src/plugin-sdk. */
export const collectSynologyChatSecurityAuditFindings: FacadeModule["collectSynologyChatSecurityAuditFindings"] =
  ((...args) =>
    loadFacadeModule().collectSynologyChatSecurityAuditFindings(
      ...args,
    )) as FacadeModule["collectSynologyChatSecurityAuditFindings"];
