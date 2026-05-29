// OpenClaw global state helpers and runtime behavior.
let globalVerbose = false;
let globalYes = false;

/** Reused helper for set Verbose behavior in src. */
export function setVerbose(v: boolean) {
  globalVerbose = v;
}

/** Reused helper for is Verbose behavior in src. */
export function isVerbose() {
  return globalVerbose;
}

/** Reused helper for set Yes behavior in src. */
export function setYes(v: boolean) {
  globalYes = v;
}

/** Reused helper for is Yes behavior in src. */
export function isYes() {
  return globalYes;
}
