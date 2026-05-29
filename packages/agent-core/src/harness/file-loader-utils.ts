// packages/agent-core/src/harness file loader utils helpers and runtime behavior.
import { parse } from "yaml";
import { type ExecutionEnv, type FileInfo, type Result, toError } from "./types.js";

/** Public type describing File Info Diagnostic for packages/agent-core. */
export interface FileInfoDiagnostic {
  type: "warning";
  code: "file_info_failed";
  message: string;
  path: string;
}

interface FileInfoDiagnostics {
  push(diagnostic: FileInfoDiagnostic): unknown;
}

/** Public helper for parse Frontmatter behavior in packages/agent-core. */
export function parseFrontmatter(
  content: string,
): Result<{ frontmatter: Record<string, unknown>; body: string }, Error> {
  try {
    const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    if (!normalized.startsWith("---")) {
      return { ok: true, value: { frontmatter: {}, body: normalized } };
    }
    const endIndex = normalized.indexOf("\n---", 3);
    if (endIndex === -1) {
      return { ok: true, value: { frontmatter: {}, body: normalized } };
    }
    const yamlString = normalized.slice(4, endIndex);
    const body = normalized.slice(endIndex + 4).trim();
    return {
      ok: true,
      value: { frontmatter: (parse(yamlString) ?? {}) as Record<string, unknown>, body },
    };
  } catch (error) {
    return { ok: false, error: toError(error) };
  }
}

/** Public helper for resolve File Info Kind behavior in packages/agent-core. */
export async function resolveFileInfoKind(
  env: ExecutionEnv,
  info: FileInfo,
  diagnostics: FileInfoDiagnostics,
): Promise<"file" | "directory" | undefined> {
  if (info.kind === "file" || info.kind === "directory") {
    return info.kind;
  }
  const canonicalPath = await env.canonicalPath(info.path);
  if (!canonicalPath.ok) {
    if (canonicalPath.error.code !== "not_found") {
      diagnostics.push({
        type: "warning",
        code: "file_info_failed",
        message: canonicalPath.error.message,
        path: info.path,
      });
    }
    return undefined;
  }
  const target = await env.fileInfo(canonicalPath.value);
  if (!target.ok) {
    if (target.error.code !== "not_found") {
      diagnostics.push({
        type: "warning",
        code: "file_info_failed",
        message: target.error.message,
        path: info.path,
      });
    }
    return undefined;
  }
  return target.value.kind === "file" || target.value.kind === "directory"
    ? target.value.kind
    : undefined;
}

/** Public helper for join Env Path behavior in packages/agent-core. */
export function joinEnvPath(base: string, child: string): string {
  return `${base.replace(/\/+$/, "")}/${child.replace(/^\/+/, "")}`;
}

/** Public helper for dirname Env Path behavior in packages/agent-core. */
export function dirnameEnvPath(path: string): string {
  const normalized = path.replace(/\/+$/, "");
  const slashIndex = normalized.lastIndexOf("/");
  return slashIndex <= 0 ? "/" : normalized.slice(0, slashIndex);
}

/** Public helper for basename Env Path behavior in packages/agent-core. */
export function basenameEnvPath(path: string): string {
  const normalized = path.replace(/\/+$/, "");
  const slashIndex = normalized.lastIndexOf("/");
  return slashIndex === -1 ? normalized : normalized.slice(slashIndex + 1);
}

/** Public helper for relative Env Path behavior in packages/agent-core. */
export function relativeEnvPath(root: string, path: string): string {
  const normalizedRoot = root.replace(/\/+$/, "");
  const normalizedPath = path.replace(/\/+$/, "");
  if (normalizedPath === normalizedRoot) {
    return "";
  }
  return normalizedPath.startsWith(`${normalizedRoot}/`)
    ? normalizedPath.slice(normalizedRoot.length + 1)
    : normalizedPath.replace(/^\/+/, "");
}
