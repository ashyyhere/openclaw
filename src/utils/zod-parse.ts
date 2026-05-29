// utils zod parse helpers and runtime behavior.
import type { ZodType } from "zod";

/** Reused helper for safe Parse With Schema behavior in src/utils. */
export function safeParseWithSchema<T>(schema: ZodType<T>, value: unknown): T | null {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

/** Reused helper for safe Parse Json With Schema behavior in src/utils. */
export function safeParseJsonWithSchema<T>(schema: ZodType<T>, raw: string): T | null {
  try {
    return safeParseWithSchema(schema, JSON.parse(raw));
  } catch {
    return null;
  }
}
