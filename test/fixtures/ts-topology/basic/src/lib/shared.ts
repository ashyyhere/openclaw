// test/fixtures/ts-topology/basic/src/lib shared helpers and runtime behavior.
export function sharedThing() {
  return "shared";
}

export function singleOwnerHelper() {
  return "single-owner";
}

export function aliasedThing() {
  return "aliased";
}

export function testOnlyThing() {
  return "test-only";
}

export function unusedThing() {
  return "unused";
}

export type SharedType = {
  value: string;
};
