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

/** Lazy facade for Synology Chat security audit rules owned by the bundled plugin. */
export const collectSynologyChatSecurityAuditFindings: FacadeModule["collectSynologyChatSecurityAuditFindings"] =
  ((...args) =>
    loadFacadeModule().collectSynologyChatSecurityAuditFindings(
      ...args,
    )) as FacadeModule["collectSynologyChatSecurityAuditFindings"];
