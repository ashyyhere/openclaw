// extensions/browser browser doctor helpers and runtime behavior.
export {
  detectLegacyClawdBrowserProfileResidue,
  maybeArchiveLegacyClawdBrowserProfileResidue,
  noteChromeMcpBrowserReadiness,
} from "./src/doctor-browser.js";
export type { LegacyClawdBrowserProfileResidue } from "./src/doctor-browser.js";
