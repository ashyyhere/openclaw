// daemon gateway entrypoint helpers and runtime behavior.
import path from "node:path";
import { pathExists } from "../utils.js";

const GATEWAY_DIST_ENTRYPOINT_BASENAMES = [
  "index.js",
  "index.mjs",
  "entry.js",
  "entry.mjs",
] as const;

/** Reused helper for is Gateway Dist Entrypoint Path behavior in src/daemon. */
export function isGatewayDistEntrypointPath(inputPath: string): boolean {
  return /[/\\]dist[/\\].+\.(cjs|js|mjs)$/.test(inputPath);
}

/** Reused helper for build Gateway Install Entrypoint Candidates behavior in src/daemon. */
export function buildGatewayInstallEntrypointCandidates(root?: string): string[] {
  if (!root) {
    return [];
  }
  return GATEWAY_DIST_ENTRYPOINT_BASENAMES.map((basename) => path.join(root, "dist", basename));
}

/** Reused helper for build Gateway Dist Entrypoint Candidates behavior in src/daemon. */
export function buildGatewayDistEntrypointCandidates(...inputs: string[]): string[] {
  const distDirs: string[] = [];
  const seenDirs = new Set<string>();

  for (const inputPath of inputs) {
    if (!isGatewayDistEntrypointPath(inputPath)) {
      continue;
    }
    const distDir = path.dirname(inputPath);
    if (seenDirs.has(distDir)) {
      continue;
    }
    seenDirs.add(distDir);
    distDirs.push(distDir);
  }

  const candidates: string[] = [];
  for (const basename of GATEWAY_DIST_ENTRYPOINT_BASENAMES) {
    for (const distDir of distDirs) {
      candidates.push(path.join(distDir, basename));
    }
  }
  return candidates;
}

/** Reused helper for find First Accessible Gateway Entrypoint behavior in src/daemon. */
export async function findFirstAccessibleGatewayEntrypoint(
  candidates: string[],
  exists: (candidate: string) => Promise<boolean> = pathExists,
): Promise<string | undefined> {
  for (const candidate of candidates) {
    if (await exists(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

/** Reused helper for resolve Gateway Install Entrypoint behavior in src/daemon. */
export async function resolveGatewayInstallEntrypoint(
  root: string | undefined,
  exists: (candidate: string) => Promise<boolean> = pathExists,
): Promise<string | undefined> {
  return findFirstAccessibleGatewayEntrypoint(
    buildGatewayInstallEntrypointCandidates(root),
    exists,
  );
}
