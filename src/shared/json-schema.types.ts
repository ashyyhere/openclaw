// Shared types for shared json schema types behavior.
import type { TSchema } from "typebox";

/** Shared type for Json Schema Object in src/shared. */
export type JsonSchemaObject = TSchema & Record<string, unknown>;
