// Applies fs-safe defaults before exposing archive extraction/merge helpers.
import "./fs-safe-defaults.js";
/** Archive safety limits, errors, preflight, and extraction helpers from fs-safe. */
export {
  ARCHIVE_LIMIT_ERROR_CODE,
  ArchiveLimitError,
  ArchiveSecurityError,
  DEFAULT_MAX_ARCHIVE_BYTES_ZIP,
  DEFAULT_MAX_ENTRIES,
  DEFAULT_MAX_EXTRACTED_BYTES,
  DEFAULT_MAX_ENTRY_BYTES,
  createArchiveSymlinkTraversalError,
  createTarEntryPreflightChecker,
  extractArchive,
  loadZipArchiveWithPreflight,
  mergeExtractedTreeIntoDestination,
  prepareArchiveDestinationDir,
  prepareArchiveOutputPath,
  readZipCentralDirectoryEntryCount,
  resolveArchiveKind,
  resolvePackedRootDir,
  withStagedArchiveDestination,
  type ArchiveExtractLimits,
  type ArchiveKind,
  type ArchiveLimitErrorCode,
  type ArchiveLogger,
  type ArchiveSecurityErrorCode,
  type TarEntryInfo,
} from "@openclaw/fs-safe/archive";
