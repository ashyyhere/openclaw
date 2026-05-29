// secrets channel env var names helpers and runtime behavior.
const UNSAFE_CHANNEL_ENV_VAR_TRIGGER_NAMES = new Set([
  "CI",
  "HOME",
  "LANG",
  "LC_ALL",
  "LC_CTYPE",
  "LOGNAME",
  "NODE_ENV",
  "OLDPWD",
  "PATH",
  "PWD",
  "SHELL",
  "SSH_AUTH_SOCK",
  "TEMP",
  "TERM",
  "TMP",
  "TMPDIR",
  "USER",
]);

/** Reused helper for is Safe Channel Env Var Trigger Name behavior in src/secrets. */
export function isSafeChannelEnvVarTriggerName(key: string): boolean {
  const normalized = key.trim().toUpperCase();
  return (
    /^[A-Z][A-Z0-9_]*$/.test(normalized) && !UNSAFE_CHANNEL_ENV_VAR_TRIGGER_NAMES.has(normalized)
  );
}
