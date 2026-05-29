// Enforces local media path allowlists before files are loaded for model input.
import fs from "node:fs/promises";
import path from "node:path";
import { assertNoWindowsNetworkPath } from "../infra/local-file-access.js";
import { isPathInside } from "../infra/path-guards.js";
import { isInboundPathAllowed } from "./inbound-path-policy.js";
import { getDefaultMediaLocalRoots } from "./local-roots.js";
import { resolveInboundMediaReference } from "./media-reference.js";

/** Machine-readable local media access denial reason. */
export type LocalMediaAccessErrorCode =
  | "path-not-allowed"
  | "invalid-root"
  | "invalid-file-url"
  | "network-path-not-allowed"
  | "unsafe-bypass"
  | "not-found"
  | "invalid-path"
  | "not-file";

/** Error thrown when a local media path is outside allowed roots or otherwise unsafe. */
export class LocalMediaAccessError extends Error {
  code: LocalMediaAccessErrorCode;

  constructor(code: LocalMediaAccessErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.code = code;
    this.name = "LocalMediaAccessError";
  }
}

/** Returns the default local roots accepted for media file access. */
export function getDefaultLocalRoots(): readonly string[] {
  return getDefaultMediaLocalRoots();
}

/** Verifies a local path is an inbound reference or contained within configured/default media roots. */
export async function assertLocalMediaAllowed(
  mediaPath: string,
  localRoots: readonly string[] | "any" | undefined,
  options?: { inboundRoots?: readonly string[] },
): Promise<void> {
  if (localRoots === "any") {
    return;
  }
  const inboundReference = await resolveInboundMediaReference(mediaPath).catch(() => null);
  if (inboundReference) {
    return;
  }
  try {
    assertNoWindowsNetworkPath(mediaPath, "Local media path");
  } catch (err) {
    throw new LocalMediaAccessError("network-path-not-allowed", (err as Error).message, {
      cause: err,
    });
  }
  if (
    options?.inboundRoots?.length &&
    isInboundPathAllowed({ filePath: mediaPath, roots: options.inboundRoots })
  ) {
    return;
  }
  const roots = localRoots ?? getDefaultLocalRoots();
  let resolved: string;
  try {
    resolved = await fs.realpath(mediaPath);
  } catch {
    resolved = path.resolve(mediaPath);
  }

  if (localRoots === undefined) {
    const workspaceRoot = roots.find((root) => path.basename(root) === "workspace");
    if (workspaceRoot) {
      const stateDir = path.dirname(workspaceRoot);
      const rel = path.relative(stateDir, resolved);
      if (rel && isPathInside(stateDir, resolved)) {
        const firstSegment = rel.split(path.sep)[0] ?? "";
        if (firstSegment.startsWith("workspace-")) {
          throw new LocalMediaAccessError(
            "path-not-allowed",
            `Local media path is not under an allowed directory: ${mediaPath}`,
          );
        }
      }
    }
  }

  for (const root of roots) {
    let resolvedRoot: string;
    try {
      resolvedRoot = await fs.realpath(root);
    } catch {
      resolvedRoot = path.resolve(root);
    }
    if (resolvedRoot === path.parse(resolvedRoot).root) {
      throw new LocalMediaAccessError(
        "invalid-root",
        `Invalid localRoots entry (refuses filesystem root): ${root}. Pass a narrower directory.`,
      );
    }
    if (isPathInside(resolvedRoot, resolved)) {
      return;
    }
  }

  throw new LocalMediaAccessError(
    "path-not-allowed",
    `Local media path is not under an allowed directory: ${mediaPath}`,
  );
}
