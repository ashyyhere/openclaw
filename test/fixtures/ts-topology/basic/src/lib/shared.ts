// Shared fixture exports for TypeScript topology ownership and import-boundary tests.
/** Fixture function representing a shared library export. */
export function sharedThing() {
  return "shared";
}

/** Fixture function with a single expected owner. */
export function singleOwnerHelper() {
  return "single-owner";
}

/** Fixture function reached through an alias import. */
export function aliasedThing() {
  return "aliased";
}

/** Fixture function allowed only from test-facing imports. */
export function testOnlyThing() {
  return "test-only";
}

/** Fixture export intentionally unused by topology tests. */
export function unusedThing() {
  return "unused";
}

/** Fixture type used by topology tests to verify type-only ownership. */
export type SharedType = {
  value: string;
};
