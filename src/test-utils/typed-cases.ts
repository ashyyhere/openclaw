// Type-preserving table-case helper for Vitest parameterized tests.
/** Preserve the inferred tuple/object type of a test case array. */
export function typedCases<T>(cases: T[]): T[] {
  return cases;
}
