/** Public input/detail contracts for built-in session tools. */
import type { Edit } from "./edit-diff.js";
import type { TruncationResult } from "./truncate.js";

/** Shared type for Bash Tool Input in src/agents/sessions. */
export interface BashToolInput {
  command: string;
  timeout?: number;
}

/** Shared type for Bash Tool Details in src/agents/sessions. */
export interface BashToolDetails {
  truncation?: TruncationResult;
  fullOutputPath?: string;
}

/** Shared type for Edit Tool Input in src/agents/sessions. */
export interface EditToolInput {
  path: string;
  edits: Edit[];
}

/** Shared type for Edit Tool Details in src/agents/sessions. */
export interface EditToolDetails {
  /** Display-oriented diff of the changes made */
  diff: string;
  /** Standard unified patch of the changes made */
  patch: string;
  /** Line number of the first change in the new file (for editor navigation) */
  firstChangedLine?: number;
}

/** Shared type for Find Tool Input in src/agents/sessions. */
export interface FindToolInput {
  pattern: string;
  path?: string;
  limit?: number;
}

/** Shared type for Find Tool Details in src/agents/sessions. */
export interface FindToolDetails {
  truncation?: TruncationResult;
  resultLimitReached?: number;
}

/** Shared type for Grep Tool Input in src/agents/sessions. */
export interface GrepToolInput {
  pattern: string;
  path?: string;
  glob?: string;
  ignoreCase?: boolean;
  literal?: boolean;
  context?: number;
  limit?: number;
}

/** Shared type for Grep Tool Details in src/agents/sessions. */
export interface GrepToolDetails {
  truncation?: TruncationResult;
  matchLimitReached?: number;
  linesTruncated?: boolean;
}

/** Shared type for Ls Tool Input in src/agents/sessions. */
export interface LsToolInput {
  path?: string;
  limit?: number;
}

/** Shared type for Ls Tool Details in src/agents/sessions. */
export interface LsToolDetails {
  truncation?: TruncationResult;
  entryLimitReached?: number;
}

/** Shared type for Read Tool Input in src/agents/sessions. */
export interface ReadToolInput {
  path: string;
  offset?: number;
  limit?: number;
}

/** Shared type for Read Tool Details in src/agents/sessions. */
export interface ReadToolDetails {
  truncation?: TruncationResult;
}

/** Shared type for Write Tool Input in src/agents/sessions. */
export interface WriteToolInput {
  path: string;
  content: string;
}
