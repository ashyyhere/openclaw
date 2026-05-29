// tools diagnostics helpers and runtime behavior.
/** Shared type for Tool Plan Contract Error Code in src/tools. */
export type ToolPlanContractErrorCode = "duplicate-tool-name" | "missing-executor";

/** Reused class for Tool Plan Contract Error behavior in src/tools. */
export class ToolPlanContractError extends Error {
  readonly code: ToolPlanContractErrorCode;
  readonly toolName: string;

  constructor(params: { code: ToolPlanContractErrorCode; toolName: string; message: string }) {
    super(params.message);
    this.name = "ToolPlanContractError";
    this.code = params.code;
    this.toolName = params.toolName;
  }
}
