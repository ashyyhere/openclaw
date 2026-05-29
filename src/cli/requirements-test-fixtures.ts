/** Test fixtures for CLI requirement check reports. */
function createEmptyRequirements() {
  return {
    bins: [],
    anyBins: [],
    env: [],
    config: [],
    os: [],
  };
}

/** Reused helper for create Empty Install Checks behavior in src/cli. */
export function createEmptyInstallChecks() {
  return {
    requirements: createEmptyRequirements(),
    missing: createEmptyRequirements(),
    configChecks: [],
    install: [],
  };
}
