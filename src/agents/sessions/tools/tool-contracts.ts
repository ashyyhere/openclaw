/** Public input/detail contracts for built-in session tools. */
import type { Edit } from "./edit-diff.js";
import type { TruncationResult } from "./truncate.js";

/** Input accepted by the built-in bash execution tool. */
export interface BashToolInput {
  command: string;
  timeout?: number;
}

/** Extra bash execution metadata returned alongside tool output. */
export interface BashToolDetails {
  truncation?: TruncationResult;
  fullOutputPath?: string;
}

/** Input accepted by the built-in multi-edit file mutation tool. */
export interface EditToolInput {
  path: string;
  edits: Edit[];
}

/** Diff metadata returned after applying edit tool changes. */
export interface EditToolDetails {
  /** Display-oriented diff of the changes made */
  diff: string;
  /** Standard unified patch of the changes made */
  patch: string;
  /** Line number of the first change in the new file (for editor navigation) */
  firstChangedLine?: number;
}

/** Input accepted by the built-in filename/content discovery helper. */
export interface FindToolInput {
  pattern: string;
  path?: string;
  limit?: number;
}

/** Truncation metadata returned by the find tool. */
export interface FindToolDetails {
  truncation?: TruncationResult;
  resultLimitReached?: number;
}

/** Input accepted by the built-in grep-style search tool. */
export interface GrepToolInput {
  pattern: string;
  path?: string;
  glob?: string;
  ignoreCase?: boolean;
  literal?: boolean;
  context?: number;
  limit?: number;
}

/** Truncation and match-limit metadata returned by grep. */
export interface GrepToolDetails {
  truncation?: TruncationResult;
  matchLimitReached?: number;
  linesTruncated?: boolean;
}

/** Input accepted by the built-in directory listing tool. */
export interface LsToolInput {
  path?: string;
  limit?: number;
}

/** Entry-limit metadata returned by directory listing. */
export interface LsToolDetails {
  truncation?: TruncationResult;
  entryLimitReached?: number;
}

/** Input accepted by the built-in file read tool. */
export interface ReadToolInput {
  path: string;
  offset?: number;
  limit?: number;
}

/** Truncation metadata returned by file reads. */
export interface ReadToolDetails {
  truncation?: TruncationResult;
}

/** Input accepted by the built-in whole-file write tool. */
export interface WriteToolInput {
  path: string;
  content: string;
}
