// CLI formatting, progress, and manager helpers exposed to memory host commands.
/** CLI presentation and command runtime helpers reused by memory host entrypoints. */
export {
  colorize,
  defaultRuntime,
  formatDocsLink,
  formatErrorMessage,
  formatHelpExamples,
  isRich,
  isVerbose,
  resolveCommandSecretRefsViaGateway,
  setVerbose,
  shortenHomeInString,
  shortenHomePath,
  theme,
  withManager,
  withProgress,
  withProgressTotals,
} from "./openclaw-runtime.js";
