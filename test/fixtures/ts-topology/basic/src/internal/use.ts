// test/fixtures/ts-topology/basic/src/internal use helpers and runtime behavior.
import { sharedThing } from "fixture-sdk";

export function internalUse() {
  return sharedThing();
}
