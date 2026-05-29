// test/fixtures/ts-topology/basic/extensions/alpha/src use helpers and runtime behavior.
import { aliasedThing as renamedThing, sharedThing, singleOwnerHelper } from "fixture-sdk";
import type { SharedType } from "fixture-sdk";
import * as extra from "fixture-sdk/extra";

export function alphaUse(input: SharedType) {
  return [
    sharedThing(),
    singleOwnerHelper(),
    renamedThing(),
    extra.sharedThing(),
    input.value,
  ].join(":");
}
