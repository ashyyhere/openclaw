/** Resolves local docs/source checkout paths and public reference URLs. */
import fs from "node:fs";
import path from "node:path";
import { resolveOpenClawPackageRoot } from "../infra/openclaw-root.js";

/** Public OpenClaw docs URL used when no local docs path is available. */
export const OPENCLAW_DOCS_URL = "https://docs.openclaw.ai";
/** Public OpenClaw source URL used when no local source checkout is available. */
export const OPENCLAW_SOURCE_URL = "https://github.com/openclaw/openclaw";

type ResolveOpenClawReferencePathParams = {
  workspaceDir?: string;
  argv1?: string;
  cwd?: string;
  moduleUrl?: string;
};

function isUsableDocsDir(docsDir: string): boolean {
  return fs.existsSync(path.join(docsDir, "docs.json"));
}

function isGitCheckout(rootDir: string): boolean {
  return fs.existsSync(path.join(rootDir, ".git"));
}

/** Resolve a local OpenClaw docs directory if one is available. */
export async function resolveOpenClawDocsPath(params: {
  workspaceDir?: string;
  argv1?: string;
  cwd?: string;
  moduleUrl?: string;
}): Promise<string | null> {
  const workspaceDir = params.workspaceDir?.trim();
  if (workspaceDir) {
    const workspaceDocs = path.join(workspaceDir, "docs");
    if (isUsableDocsDir(workspaceDocs)) {
      return workspaceDocs;
    }
  }

  const packageRoot = await resolveOpenClawPackageRoot({
    cwd: params.cwd,
    argv1: params.argv1,
    moduleUrl: params.moduleUrl,
  });
  if (!packageRoot) {
    return null;
  }

  const packageDocs = path.join(packageRoot, "docs");
  return isUsableDocsDir(packageDocs) ? packageDocs : null;
}

/** Resolve a local OpenClaw git checkout root if one is available. */
export async function resolveOpenClawSourcePath(
  params: ResolveOpenClawReferencePathParams,
): Promise<string | null> {
  const packageRoot = await resolveOpenClawPackageRoot({
    cwd: params.cwd,
    argv1: params.argv1,
    moduleUrl: params.moduleUrl,
  });
  if (!packageRoot || !isGitCheckout(packageRoot)) {
    return null;
  }
  return packageRoot;
}

/** Resolve local docs and source reference paths in parallel. */
export async function resolveOpenClawReferencePaths(
  params: ResolveOpenClawReferencePathParams,
): Promise<{
  docsPath: string | null;
  sourcePath: string | null;
}> {
  const [docsPath, sourcePath] = await Promise.all([
    resolveOpenClawDocsPath(params),
    resolveOpenClawSourcePath(params),
  ]);
  return { docsPath, sourcePath };
}
