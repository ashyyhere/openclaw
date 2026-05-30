// Public topology fixture barrel forwards shared symbols for ownership checks.
/** Public fixture exports used by TypeScript topology tests. */
export {
  aliasedThing,
  sharedThing,
  singleOwnerHelper,
  testOnlyThing,
  unusedThing,
} from "../lib/shared.js";
/** Alias re-export fixture for topology alias resolution checks. */
export { sharedThing as aliasedSharedThing } from "../lib/shared.js";
/** Type-only public fixture export for topology tests. */
export type { SharedType } from "../lib/shared.js";
