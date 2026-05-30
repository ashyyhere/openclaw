import type { OpenClawConfig } from "../config/types.js";
import type { SecurityAuditFinding } from "../security/audit.types.js";
import { loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader.js";

type SecuritySurface = {
  collectFeishuSecurityAuditFindings: (params: { cfg: OpenClawConfig }) => SecurityAuditFinding[];
};

function loadSecuritySurface(): SecuritySurface {
  return loadBundledPluginPublicSurfaceModuleSync<SecuritySurface>({
    dirName: "feishu",
    artifactBasename: "security-contract-api.js",
  });
}

/** Lazy facade for Feishu security audit rules owned by the bundled plugin. */
export const collectFeishuSecurityAuditFindings: SecuritySurface["collectFeishuSecurityAuditFindings"] =
  ((...args) =>
    loadSecuritySurface().collectFeishuSecurityAuditFindings(
      ...args,
    )) as SecuritySurface["collectFeishuSecurityAuditFindings"];
