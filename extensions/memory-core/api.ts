// extensions/memory-core api helpers and runtime behavior.
/** Re-exported memory-core plugin public API, starting with Open Claw Config. */
export type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
/** Re-exported memory-core plugin public API. */
export type {
  MemoryEmbeddingProbeResult,
  MemoryProviderStatus,
  MemorySyncProgressUpdate,
} from "openclaw/plugin-sdk/memory-core-host-engine-storage";
/** Re-exported memory-core plugin public API. */
export {
  dedupeDreamDiaryEntries,
  removeBackfillDiaryEntries,
  writeBackfillDiaryEntries,
} from "./src/dreaming-narrative.js";
/** Re-exported memory-core plugin public API, starting with preview Grounded Rem Markdown. */
export { previewGroundedRemMarkdown } from "./src/rem-evidence.js";
/** Re-exported memory-core plugin public API, starting with filter Recall Entries Within Lookback. */
export { filterRecallEntriesWithinLookback } from "./src/dreaming-phases.js";
/** Re-exported memory-core plugin public API, starting with preview Rem Harness. */
export { previewRemHarness } from "./src/rem-harness.js";
/** Re-exported memory-core plugin public API, starting with Preview Rem Harness Options. */
export type { PreviewRemHarnessOptions, PreviewRemHarnessResult } from "./src/rem-harness.js";
