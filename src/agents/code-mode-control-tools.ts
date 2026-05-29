/** Marks and normalizes code-mode control tools for hooks and policy checks. */
import { isPlainObject } from "../utils.js";
import { normalizeToolName } from "./tool-policy.js";
import type { AnyAgentTool } from "./tools/common.js";

/** Public tool name for starting a code-mode execution. */
export const CODE_MODE_EXEC_TOOL_NAME = "exec";
/** Public tool name for resuming a waiting code-mode execution. */
export const CODE_MODE_WAIT_TOOL_NAME = "wait";
/** Stable internal tool kind used by before-tool-call hook metadata. */
export const CODE_MODE_EXEC_TOOL_KIND = "code_mode_exec";

/** Internal kind marker for code-mode exec hook events. */
export type CodeModeExecToolKind = typeof CODE_MODE_EXEC_TOOL_KIND;
/** Supported code-mode exec input languages. */
export type CodeModeExecToolInputKind = "javascript" | "typescript";
/** Metadata attached to before-tool-call hook events for code-mode exec. */
export type CodeModeExecHookMetadata = {
  toolKind: CodeModeExecToolKind;
  toolInputKind?: CodeModeExecToolInputKind;
};

const codeModeControlTools = new WeakSet<AnyAgentTool>();

/** Mark a tool as a code-mode control tool without changing its public shape. */
export function markCodeModeControlTool<T extends AnyAgentTool>(tool: T): T {
  codeModeControlTools.add(tool);
  return tool;
}

/** Return whether a tool was created as a code-mode control tool. */
export function isCodeModeControlTool(tool: AnyAgentTool): boolean {
  return codeModeControlTools.has(tool);
}

function isCodeModeExecTool(tool: AnyAgentTool): boolean {
  return isCodeModeControlTool(tool) && normalizeToolName(tool.name) === CODE_MODE_EXEC_TOOL_NAME;
}

function resolveCodeModeExecToolInputKind(params: unknown): CodeModeExecToolInputKind | undefined {
  if (!isPlainObject(params)) {
    return undefined;
  }
  const language = params.language;
  if (language === undefined || language === "javascript") {
    return "javascript";
  }
  if (language === "typescript") {
    return "typescript";
  }
  return undefined;
}

function normalizeCodeModeExecParams(params: unknown): unknown {
  if (!isPlainObject(params)) {
    return params;
  }
  const code = params.code;
  const command = params.command;
  if (typeof code === "string" && typeof command !== "string") {
    return { ...params, command: params.code };
  }
  if (typeof command === "string" && typeof code !== "string") {
    return { ...params, code: params.command };
  }
  return params;
}

/** Build before-tool-call metadata for code-mode exec tools. */
export function getCodeModeExecBeforeHookMetadata(params: {
  tool: AnyAgentTool;
  params: unknown;
}): CodeModeExecHookMetadata | undefined {
  if (!isCodeModeExecTool(params.tool)) {
    return undefined;
  }
  const toolInputKind = resolveCodeModeExecToolInputKind(params.params);
  return {
    toolKind: CODE_MODE_EXEC_TOOL_KIND,
    ...(toolInputKind && { toolInputKind }),
  };
}

/** Build before-tool-call metadata from serialized code-mode tool kind. */
export function getCodeModeExecBeforeHookMetadataForToolKind(params: {
  toolKind: unknown;
  params: unknown;
}): CodeModeExecHookMetadata | undefined {
  if (params.toolKind !== CODE_MODE_EXEC_TOOL_KIND) {
    return undefined;
  }
  const toolInputKind = resolveCodeModeExecToolInputKind(params.params);
  return {
    toolKind: CODE_MODE_EXEC_TOOL_KIND,
    ...(toolInputKind && { toolInputKind }),
  };
}

/** Normalize exec hook params so `code` and `command` aliases stay equivalent. */
export function normalizeCodeModeExecBeforeHookParams(params: {
  tool: AnyAgentTool;
  params: unknown;
}): unknown {
  if (!isCodeModeExecTool(params.tool)) {
    return params.params;
  }
  return normalizeCodeModeExecParams(params.params);
}

/** Normalize exec hook params when only serialized tool kind is available. */
export function normalizeCodeModeExecBeforeHookParamsForToolKind(params: {
  toolKind: unknown;
  params: unknown;
}): unknown {
  if (params.toolKind !== CODE_MODE_EXEC_TOOL_KIND) {
    return params.params;
  }
  return normalizeCodeModeExecParams(params.params);
}

/** Reconcile hook-mutated exec aliases back into a consistent tool payload. */
export function reconcileCodeModeExecBeforeHookParams(params: {
  tool: AnyAgentTool;
  originalParams: unknown;
  hookParams: unknown;
  adjustedParams: unknown;
}): unknown {
  if (
    !isCodeModeExecTool(params.tool) ||
    !isPlainObject(params.originalParams) ||
    !isPlainObject(params.hookParams) ||
    !isPlainObject(params.adjustedParams)
  ) {
    return params.adjustedParams;
  }
  const hookCode = params.hookParams.code;
  const hookCommand = params.hookParams.command;
  if (typeof hookCode !== "string" || hookCode !== hookCommand) {
    return params.adjustedParams;
  }

  const adjustedCode = params.adjustedParams.code;
  const adjustedCommand = params.adjustedParams.command;
  const adjustedCodeChanged = typeof adjustedCode === "string" && adjustedCode !== hookCode;
  const adjustedCommandChanged =
    typeof adjustedCommand === "string" && adjustedCommand !== hookCode;
  if (adjustedCodeChanged === adjustedCommandChanged) {
    return params.adjustedParams;
  }

  if (adjustedCodeChanged) {
    return { ...params.adjustedParams, command: adjustedCode };
  }
  if (adjustedCommandChanged) {
    return { ...params.adjustedParams, code: adjustedCommand };
  }
  return params.adjustedParams;
}
