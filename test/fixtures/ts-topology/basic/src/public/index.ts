// test/fixtures/ts-topology/basic/src/public index helpers and runtime behavior.
export {
  aliasedThing,
  sharedThing,
  singleOwnerHelper,
  testOnlyThing,
  unusedThing,
} from "../lib/shared.js";
export { sharedThing as aliasedSharedThing } from "../lib/shared.js";
export type { SharedType } from "../lib/shared.js";
