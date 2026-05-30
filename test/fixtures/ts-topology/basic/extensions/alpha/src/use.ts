// Alpha extension topology fixture imports shared, alias, and extra SDK symbols.
import { aliasedThing as renamedThing, sharedThing, singleOwnerHelper } from "fixture-sdk";
import type { SharedType } from "fixture-sdk";
import * as extra from "fixture-sdk/extra";

/** Alpha extension fixture consumer for topology ownership tests. */
export function alphaUse(input: SharedType) {
  return [
    sharedThing(),
    singleOwnerHelper(),
    renamedThing(),
    extra.sharedThing(),
    input.value,
  ].join(":");
}
