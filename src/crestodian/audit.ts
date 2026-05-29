// crestodian audit helpers and runtime behavior.
import fs from "node:fs/promises";
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";
import { appendRegularFile } from "../infra/fs-safe.js";

type CrestodianAuditEntry = {
  timestamp: string;
  operation: string;
  summary: string;
  configPath?: string;
  configHashBefore?: string | null;
  configHashAfter?: string | null;
  details?: Record<string, unknown>;
};

/** Reused helper for resolve Crestodian Audit Path behavior in src/crestodian. */
export function resolveCrestodianAuditPath(
  env: NodeJS.ProcessEnv = process.env,
  stateDir = resolveStateDir(env),
): string {
  return path.join(stateDir, "audit", "crestodian.jsonl");
}

/** Reused helper for append Crestodian Audit Entry behavior in src/crestodian. */
export async function appendCrestodianAuditEntry(
  entry: Omit<CrestodianAuditEntry, "timestamp">,
  opts: { env?: NodeJS.ProcessEnv; auditPath?: string } = {},
): Promise<string> {
  const auditPath = opts.auditPath ?? resolveCrestodianAuditPath(opts.env);
  await fs.mkdir(path.dirname(auditPath), { recursive: true });
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...entry,
  } satisfies CrestodianAuditEntry);
  await appendRegularFile({
    filePath: auditPath,
    content: `${line}\n`,
    rejectSymlinkParents: true,
  });
  return auditPath;
}
