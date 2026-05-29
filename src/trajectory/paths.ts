// trajectory paths helpers and runtime behavior.
import fs from "node:fs";
import path from "node:path";
import { resolveHomeRelativePath } from "../infra/home-dir.js";
import { isPathInside } from "../infra/path-guards.js";

/** Reused constant for TRAJECTORY RUNTIME CAPTURE MAX BYTES behavior in src/trajectory. */
export const TRAJECTORY_RUNTIME_CAPTURE_MAX_BYTES = 10 * 1024 * 1024;
/** Reused constant for TRAJECTORY RUNTIME FILE MAX BYTES behavior in src/trajectory. */
export const TRAJECTORY_RUNTIME_FILE_MAX_BYTES = 50 * 1024 * 1024;
/** Reused constant for TRAJECTORY RUNTIME EVENT MAX BYTES behavior in src/trajectory. */
export const TRAJECTORY_RUNTIME_EVENT_MAX_BYTES = 256 * 1024;

type TrajectoryPointerOpenFlagConstants = Pick<
  typeof fs.constants,
  "O_CREAT" | "O_TRUNC" | "O_WRONLY"
> &
  Partial<Pick<typeof fs.constants, "O_NOFOLLOW">>;

/** Reused helper for safe Trajectory Session File Name behavior in src/trajectory. */
export function safeTrajectorySessionFileName(sessionId: string): string {
  const safe = sessionId.replaceAll(/[^A-Za-z0-9_-]/g, "_").slice(0, 120);
  return /[A-Za-z0-9]/u.test(safe) ? safe : "session";
}

/** Reused helper for resolve Trajectory Pointer Open Flags behavior in src/trajectory. */
export function resolveTrajectoryPointerOpenFlags(
  constants: TrajectoryPointerOpenFlagConstants = fs.constants,
): number {
  const noFollow = constants.O_NOFOLLOW;
  return (
    constants.O_CREAT |
    constants.O_TRUNC |
    constants.O_WRONLY |
    (typeof noFollow === "number" ? noFollow : 0)
  );
}

function resolveContainedPath(baseDir: string, fileName: string): string {
  const resolvedBase = path.resolve(baseDir);
  const resolvedFile = path.resolve(resolvedBase, fileName);
  if (resolvedFile === resolvedBase || !isPathInside(resolvedBase, resolvedFile)) {
    throw new Error("Trajectory file path escaped its configured directory");
  }
  return resolvedFile;
}

/** Reused helper for resolve Trajectory File Path behavior in src/trajectory. */
export function resolveTrajectoryFilePath(params: {
  env?: NodeJS.ProcessEnv;
  sessionFile?: string;
  sessionId: string;
}): string {
  const env = params.env ?? process.env;
  const dirOverride = env.OPENCLAW_TRAJECTORY_DIR?.trim();
  if (dirOverride) {
    return resolveContainedPath(
      resolveHomeRelativePath(dirOverride),
      `${safeTrajectorySessionFileName(params.sessionId)}.jsonl`,
    );
  }
  if (!params.sessionFile) {
    return path.join(
      process.cwd(),
      `${safeTrajectorySessionFileName(params.sessionId)}.trajectory.jsonl`,
    );
  }
  return params.sessionFile.endsWith(".jsonl")
    ? `${params.sessionFile.slice(0, -".jsonl".length)}.trajectory.jsonl`
    : `${params.sessionFile}.trajectory.jsonl`;
}

/** Reused helper for resolve Trajectory Pointer File Path behavior in src/trajectory. */
export function resolveTrajectoryPointerFilePath(sessionFile: string): string {
  return sessionFile.endsWith(".jsonl")
    ? `${sessionFile.slice(0, -".jsonl".length)}.trajectory-path.json`
    : `${sessionFile}.trajectory-path.json`;
}
