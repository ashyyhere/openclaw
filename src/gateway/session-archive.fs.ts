// gateway session archive fs helpers and runtime behavior.
/** Re-exported API for src/gateway. */
export {
  archiveFileOnDisk,
  archiveSessionTranscriptsDetailed,
  archiveSessionTranscripts,
  cleanupArchivedSessionTranscripts,
  resolveStableSessionEndTranscript,
} from "./session-transcript-files.fs.js";
