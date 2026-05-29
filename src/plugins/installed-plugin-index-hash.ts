// plugins installed plugin index hash helpers and runtime behavior.
import crypto from "node:crypto";
import fs from "node:fs";
import type { PluginDiagnostic } from "./manifest-types.js";

/** Shared type for Installed Plugin File Signature in src/plugins. */
export type InstalledPluginFileSignature = {
  size: number;
  mtimeMs: number;
  ctimeMs?: number;
};

function hashString(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Reused helper for hash Json behavior in src/plugins. */
export function hashJson(value: unknown): string {
  return hashString(JSON.stringify(value));
}

/** Reused helper for safe Hash File behavior in src/plugins. */
export function safeHashFile(params: {
  filePath: string;
  pluginId?: string;
  diagnostics: PluginDiagnostic[];
  required: boolean;
}): string | undefined {
  try {
    return crypto.createHash("sha256").update(fs.readFileSync(params.filePath)).digest("hex");
  } catch (err) {
    if (params.required) {
      params.diagnostics.push({
        level: "warn",
        ...(params.pluginId ? { pluginId: params.pluginId } : {}),
        source: params.filePath,
        message: `installed plugin index could not hash ${params.filePath}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      });
    }
    return undefined;
  }
}

/** Reused helper for safe File Signature behavior in src/plugins. */
export function safeFileSignature(filePath: string): InstalledPluginFileSignature | undefined {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return undefined;
    }
    return {
      size: stat.size,
      mtimeMs: stat.mtimeMs,
      ctimeMs: stat.ctimeMs,
    };
  } catch {
    return undefined;
  }
}

/** Reused helper for file Signature Matches behavior in src/plugins. */
export function fileSignatureMatches(
  filePath: string,
  signature: InstalledPluginFileSignature | undefined,
): boolean | undefined {
  if (!signature) {
    return undefined;
  }
  if (typeof signature.ctimeMs !== "number") {
    return undefined;
  }
  const current = safeFileSignature(filePath);
  if (!current) {
    return false;
  }
  return (
    current.size === signature.size &&
    current.mtimeMs === signature.mtimeMs &&
    current.ctimeMs === signature.ctimeMs
  );
}
