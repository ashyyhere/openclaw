/** Factory exports for built-in session coding tools. */
export {
  type BashSpawnContext,
  type BashSpawnHook,
  type BashToolOptions,
  createBashTool,
  createBashToolDefinition,
  createLocalBashOperations,
} from "./bash.js";
/** File-system and process operations used by the bash tool implementation. */
export type { BashOperations } from "./bash-operations.js";
/** Built-in tool input and detail contracts shared by tool definitions. */
export type {
  BashToolDetails,
  BashToolInput,
  EditToolDetails,
  EditToolInput,
  FindToolDetails,
  FindToolInput,
  GrepToolDetails,
  GrepToolInput,
  LsToolDetails,
  LsToolInput,
  ReadToolDetails,
  ReadToolInput,
  WriteToolInput,
} from "./tool-contracts.js";
/** Edit tool factory and operation contracts. */
export {
  createEditTool,
  createEditToolDefinition,
  type EditOperations,
  type EditToolOptions,
} from "./edit.js";
/** Serializes file mutations so write/edit tools do not race each other. */
export { withFileMutationQueue } from "./file-mutation-queue.js";
/** Find tool factory and operation contracts. */
export {
  createFindTool,
  createFindToolDefinition,
  type FindOperations,
  type FindToolOptions,
} from "./find.js";
/** Grep tool factory and operation contracts. */
export {
  createGrepTool,
  createGrepToolDefinition,
  type GrepOperations,
  type GrepToolOptions,
} from "./grep.js";
/** Directory listing tool factory and operation contracts. */
export {
  createLsTool,
  createLsToolDefinition,
  type LsOperations,
  type LsToolOptions,
} from "./ls.js";
/** Read tool factory and operation contracts. */
export {
  createReadTool,
  createReadToolDefinition,
  type ReadOperations,
  type ReadToolOptions,
} from "./read.js";
/** Shared truncation helpers for file and command output tools. */
export {
  DEFAULT_MAX_BYTES,
  DEFAULT_MAX_LINES,
  formatSize,
  type TruncationOptions,
  type TruncationResult,
  truncateHead,
  truncateLine,
  truncateTail,
} from "./truncate.js";
/** Write tool factory and operation contracts. */
export {
  createWriteTool,
  createWriteToolDefinition,
  type WriteOperations,
  type WriteToolOptions,
} from "./write.js";

import type { AgentTool } from "../../runtime/index.js";
import type { ToolDefinition } from "../extensions/types.js";
import { type BashToolOptions, createBashTool, createBashToolDefinition } from "./bash.js";
import { createEditTool, createEditToolDefinition, type EditToolOptions } from "./edit.js";
import { createFindTool, createFindToolDefinition, type FindToolOptions } from "./find.js";
import { createGrepTool, createGrepToolDefinition, type GrepToolOptions } from "./grep.js";
import { createLsTool, createLsToolDefinition, type LsToolOptions } from "./ls.js";
import { createReadTool, createReadToolDefinition, type ReadToolOptions } from "./read.js";
import { createWriteTool, createWriteToolDefinition, type WriteToolOptions } from "./write.js";

/** Runtime tool instance type used by built-in session tools. */
export type Tool = AgentTool;
/** Model-facing tool definition type used by built-in session tools. */
export type ToolDef = ToolDefinition;
/** Supported built-in session tool names. */
export type ToolName = "read" | "bash" | "edit" | "write" | "grep" | "find" | "ls";
/** Set of all supported built-in session tool names. */
export const allToolNames: Set<ToolName> = new Set([
  "read",
  "bash",
  "edit",
  "write",
  "grep",
  "find",
  "ls",
]);

/** Per-tool options passed into built-in session tool factories. */
export interface ToolsOptions {
  read?: ReadToolOptions;
  bash?: BashToolOptions;
  write?: WriteToolOptions;
  edit?: EditToolOptions;
  grep?: GrepToolOptions;
  find?: FindToolOptions;
  ls?: LsToolOptions;
}

/** Creates one built-in tool definition by tool name. */
export function createToolDefinition(
  toolName: ToolName,
  cwd: string,
  options?: ToolsOptions,
): ToolDef {
  switch (toolName) {
    case "read":
      return createReadToolDefinition(cwd, options?.read);
    case "bash":
      return createBashToolDefinition(cwd, options?.bash);
    case "edit":
      return createEditToolDefinition(cwd, options?.edit);
    case "write":
      return createWriteToolDefinition(cwd, options?.write);
    case "grep":
      return createGrepToolDefinition(cwd, options?.grep);
    case "find":
      return createFindToolDefinition(cwd, options?.find);
    case "ls":
      return createLsToolDefinition(cwd, options?.ls);
    default:
      throw new Error(`Unknown tool name: ${String(toolName)}`);
  }
}

/** Creates one built-in AgentTool by tool name. */
export function createTool(toolName: ToolName, cwd: string, options?: ToolsOptions): Tool {
  switch (toolName) {
    case "read":
      return createReadTool(cwd, options?.read);
    case "bash":
      return createBashTool(cwd, options?.bash);
    case "edit":
      return createEditTool(cwd, options?.edit);
    case "write":
      return createWriteTool(cwd, options?.write);
    case "grep":
      return createGrepTool(cwd, options?.grep);
    case "find":
      return createFindTool(cwd, options?.find);
    case "ls":
      return createLsTool(cwd, options?.ls);
    default:
      throw new Error(`Unknown tool name: ${String(toolName)}`);
  }
}

/** Creates write-capable built-in tool definitions. */
export function createCodingToolDefinitions(cwd: string, options?: ToolsOptions): ToolDef[] {
  return [
    createReadToolDefinition(cwd, options?.read),
    createBashToolDefinition(cwd, options?.bash),
    createEditToolDefinition(cwd, options?.edit),
    createWriteToolDefinition(cwd, options?.write),
  ];
}

/** Creates read-only built-in tool definitions. */
export function createReadOnlyToolDefinitions(cwd: string, options?: ToolsOptions): ToolDef[] {
  return [
    createReadToolDefinition(cwd, options?.read),
    createGrepToolDefinition(cwd, options?.grep),
    createFindToolDefinition(cwd, options?.find),
    createLsToolDefinition(cwd, options?.ls),
  ];
}

/** Creates all built-in tool definitions. */
export function createAllToolDefinitions(
  cwd: string,
  options?: ToolsOptions,
): Record<ToolName, ToolDef> {
  return {
    read: createReadToolDefinition(cwd, options?.read),
    bash: createBashToolDefinition(cwd, options?.bash),
    edit: createEditToolDefinition(cwd, options?.edit),
    write: createWriteToolDefinition(cwd, options?.write),
    grep: createGrepToolDefinition(cwd, options?.grep),
    find: createFindToolDefinition(cwd, options?.find),
    ls: createLsToolDefinition(cwd, options?.ls),
  };
}

/** Creates write-capable built-in AgentTools. */
export function createCodingTools(cwd: string, options?: ToolsOptions): Tool[] {
  return [
    createReadTool(cwd, options?.read),
    createBashTool(cwd, options?.bash),
    createEditTool(cwd, options?.edit),
    createWriteTool(cwd, options?.write),
  ];
}

/** Creates read-only built-in AgentTools. */
export function createReadOnlyTools(cwd: string, options?: ToolsOptions): Tool[] {
  return [
    createReadTool(cwd, options?.read),
    createGrepTool(cwd, options?.grep),
    createFindTool(cwd, options?.find),
    createLsTool(cwd, options?.ls),
  ];
}

/** Creates all built-in AgentTools keyed by tool name. */
export function createAllTools(cwd: string, options?: ToolsOptions): Record<ToolName, Tool> {
  return {
    read: createReadTool(cwd, options?.read),
    bash: createBashTool(cwd, options?.bash),
    edit: createEditTool(cwd, options?.edit),
    write: createWriteTool(cwd, options?.write),
    grep: createGrepTool(cwd, options?.grep),
    find: createFindTool(cwd, options?.find),
    ls: createLsTool(cwd, options?.ls),
  };
}
