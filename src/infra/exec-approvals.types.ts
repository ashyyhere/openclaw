// Shared types for infra exec approvals types behavior.
/** Shared type for Exec Allowlist Entry in src/infra. */
export type ExecAllowlistEntry = {
  id?: string;
  pattern: string;
  source?: "allow-always";
  commandText?: string;
  argPattern?: string;
  lastUsedAt?: number;
  lastUsedCommand?: string;
  lastResolvedPath?: string;
};
