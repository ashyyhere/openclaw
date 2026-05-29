/** Runtime SDK barrel for poll input normalization helpers. */
export type { NormalizedPollInput, PollInput } from "../polls.js";
/** Re-exported API for src/plugin-sdk. */
export {
  normalizePollDurationHours,
  normalizePollInput,
  resolvePollMaxSelections,
} from "../polls.js";
