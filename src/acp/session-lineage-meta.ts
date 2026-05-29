/** ACP lineage metadata projection for spawned/subagent sessions. */
import type { GatewaySessionRow } from "../gateway/session-utils.js";
import { normalizeOptionalString } from "../shared/string-coerce.js";

const SUBAGENT_ROLES = ["orchestrator", "leaf"] as const;
const SUBAGENT_CONTROL_SCOPES = ["children", "none"] as const;

type SubagentRole = (typeof SUBAGENT_ROLES)[number];
type SubagentControlScope = (typeof SUBAGENT_CONTROL_SCOPES)[number];

/** Shared type for Acp Session Lineage Meta in src/acp. */
export type AcpSessionLineageMeta = {
  sessionKey: string;
  kind?: string;
  channel?: string;
  parentSessionId?: string;
  spawnedBy?: string;
  spawnDepth?: number;
  subagentRole?: SubagentRole;
  subagentControlScope?: SubagentControlScope;
  spawnedWorkspaceDir?: string;
  spawnedCwd?: string;
};

/** Gateway session row fields needed to render ACP lineage metadata. */
export type AcpSessionLineageRow = Pick<
  GatewaySessionRow,
  | "key"
  | "kind"
  | "channel"
  | "parentSessionKey"
  | "spawnedBy"
  | "spawnDepth"
  | "subagentRole"
  | "subagentControlScope"
  | "spawnedWorkspaceDir"
  | "spawnedCwd"
>;

function readInteger(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    return undefined;
  }
  return value;
}

function readEnum<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  const normalized = normalizeOptionalString(value);
  return allowed.find((candidate) => candidate === normalized);
}

/** Convert a gateway session row into ACP session-lineage metadata. */
export function toAcpSessionLineageMeta(row: AcpSessionLineageRow): AcpSessionLineageMeta {
  const sessionKey = normalizeOptionalString(row.key) ?? row.key;
  const kind = normalizeOptionalString(row.kind);
  const channel = normalizeOptionalString(row.channel);
  const parentSessionId =
    normalizeOptionalString(row.parentSessionKey) ?? normalizeOptionalString(row.spawnedBy);
  const spawnedBy = normalizeOptionalString(row.spawnedBy);
  const spawnDepth = readInteger(row.spawnDepth);
  const subagentRole = readEnum(row.subagentRole, SUBAGENT_ROLES);
  const subagentControlScope = readEnum(row.subagentControlScope, SUBAGENT_CONTROL_SCOPES);
  const spawnedWorkspaceDir = normalizeOptionalString(row.spawnedWorkspaceDir);
  const spawnedCwd = normalizeOptionalString(row.spawnedCwd);

  return {
    sessionKey,
    ...(kind ? { kind } : {}),
    ...(channel ? { channel } : {}),
    ...(parentSessionId ? { parentSessionId } : {}),
    ...(spawnedBy ? { spawnedBy } : {}),
    ...(spawnDepth !== undefined ? { spawnDepth } : {}),
    ...(subagentRole ? { subagentRole } : {}),
    ...(subagentControlScope ? { subagentControlScope } : {}),
    ...(spawnedWorkspaceDir ? { spawnedWorkspaceDir } : {}),
    ...(spawnedCwd ? { spawnedCwd } : {}),
  };
}
