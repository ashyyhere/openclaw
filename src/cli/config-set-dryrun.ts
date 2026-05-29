/** Types for dry-run previews of config set operations. */
export type ConfigSetDryRunInputMode = "value" | "json" | "builder" | "unset";

/** Shared type for Config Set Dry Run Error in src/cli. */
export type ConfigSetDryRunError = {
  kind: "missing-path" | "schema" | "resolvability";
  message: string;
  ref?: string;
};

/** Shared type for Config Set Dry Run Result in src/cli. */
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
