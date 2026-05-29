// Errors raised when registered descriptors violate tool-planning invariants.
/** Contract violation codes detected while building a tool plan. */
export type ToolPlanContractErrorCode = "duplicate-tool-name" | "missing-executor";

/** Error type that preserves the offending tool name and machine-readable code. */
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
