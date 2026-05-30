// Internal topology fixture imports from the public SDK alias to model forbidden use cases.
import { sharedThing } from "fixture-sdk";

/** Internal fixture consumer used by topology boundary tests. */
export function internalUse() {
  return sharedThing();
}
