// infra embedded mode helpers and runtime behavior.
let embeddedModeValue = false;

/** Reused helper for set Embedded Mode behavior in src/infra. */
export function setEmbeddedMode(value: boolean): void {
  embeddedModeValue = value;
}

/** Reused helper for is Embedded Mode behavior in src/infra. */
export function isEmbeddedMode(): boolean {
  return embeddedModeValue;
}
