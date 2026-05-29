// test/fixtures/ts-topology/basic/extensions/beta/src use helpers and runtime behavior.
import { sharedThing } from "fixture-sdk";
import type { SharedType } from "fixture-sdk";

export function betaUse(input: SharedType) {
  return `${sharedThing()}:${input.value}`;
}
