// Report types shared by security audit collection and presentation.
/** Severity buckets used by security audit findings and summaries. */
export type SecurityAuditSeverity = "info" | "warn" | "critical";

/** One actionable security audit finding. */
export type SecurityAuditFinding = {
  checkId: string;
  severity: SecurityAuditSeverity;
  title: string;
  detail: string;
  remediation?: string;
};

/** Finding retained in the report but hidden from active results by suppression config. */
export type SecurityAuditSuppressedFinding = SecurityAuditFinding & {
  suppression: {
    reason?: string;
  };
};

/** Counts of active findings by severity. */
export type SecurityAuditSummary = {
  critical: number;
  warn: number;
  info: number;
};

/** Full security audit report returned by CLI/API callers. */
export type SecurityAuditReport = {
  ts: number;
  summary: SecurityAuditSummary;
  findings: SecurityAuditFinding[];
  suppressedFindings?: SecurityAuditSuppressedFinding[];
  deep?: {
    gateway?: {
      attempted: boolean;
      url: string | null;
      ok: boolean;
      error: string | null;
      close?: { code: number; reason: string } | null;
    };
  };
};
