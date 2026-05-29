// Shared types for plugins install security scan types behavior.
/** Shared type for Install Safety Overrides in src/plugins. */
export type InstallSafetyOverrides = {
  dangerouslyForceUnsafeInstall?: boolean;
  trustedSourceLinkedOfficialInstall?: boolean;
};
