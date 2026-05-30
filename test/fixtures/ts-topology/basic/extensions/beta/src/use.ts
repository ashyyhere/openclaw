// Beta extension topology fixture consumes the shared SDK symbol and type.
import { sharedThing } from "fixture-sdk";
import type { SharedType } from "fixture-sdk";

/** Beta extension fixture consumer for topology ownership tests. */
export function betaUse(input: SharedType) {
  return `${sharedThing()}:${input.value}`;
}
