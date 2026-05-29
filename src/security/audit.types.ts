// Shared types for security audit types behavior.
/** Shared type for Security Audit Severity in src/security. */
export type SecurityAuditSeverity = "info" | "warn" | "critical";

/** Shared type for Security Audit Finding in src/security. */
export type SecurityAuditFinding = {
  checkId: string;
  severity: SecurityAuditSeverity;
  title: string;
  detail: string;
  remediation?: string;
};

/** Shared type for Security Audit Suppressed Finding in src/security. */
export type SecurityAuditSuppressedFinding = SecurityAuditFinding & {
  suppression: {
    reason?: string;
  };
};

/** Shared type for Security Audit Summary in src/security. */
export type SecurityAuditSummary = {
  critical: number;
  warn: number;
  info: number;
};

/** Shared type for Security Audit Report in src/security. */
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
