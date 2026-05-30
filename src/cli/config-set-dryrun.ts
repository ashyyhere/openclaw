/**
 * Input mode recorded for config-set dry-run summaries.
 */
export type ConfigSetDryRunInputMode = "value" | "json" | "builder" | "unset";

/** Structured dry-run failure for path, schema, or secret-resolvability checks. */
export type ConfigSetDryRunError = {
  kind: "missing-path" | "schema" | "resolvability";
  message: string;
  ref?: string;
};

/** Dry-run result reported before mutating config so callers can explain planned writes. */
export type ConfigSetDryRunResult = {
  ok: boolean;
  operations: number;
  configPath: string;
  inputModes: ConfigSetDryRunInputMode[];
  checks: {
    schema: boolean;
    resolvability: boolean;
    resolvabilityComplete: boolean;
  };
  refsChecked: number;
  skippedExecRefs: number;
  errors?: ConfigSetDryRunError[];
};
