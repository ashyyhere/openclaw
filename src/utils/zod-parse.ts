// Small zod parsing adapters for permissive config/runtime boundaries.
import type { ZodType } from "zod";

/** Parse an unknown value with a zod schema, returning null on validation failure. */
export function safeParseWithSchema<T>(schema: ZodType<T>, value: unknown): T | null {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

/** JSON-parse and validate with a zod schema, returning null for invalid input. */
export function safeParseJsonWithSchema<T>(schema: ZodType<T>, raw: string): T | null {
  try {
    return safeParseWithSchema(schema, JSON.parse(raw));
  } catch {
    return null;
  }
}
