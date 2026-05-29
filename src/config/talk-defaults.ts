// config talk defaults helpers and runtime behavior.
/** Reused constant for TALK SILENCE TIMEOUT MS BY PLATFORM behavior in src/config. */
export const TALK_SILENCE_TIMEOUT_MS_BY_PLATFORM = {
  macos: 700,
  android: 700,
  ios: 900,
} as const;

/** Reused helper for describe Talk Silence Timeout Defaults behavior in src/config. */
export function describeTalkSilenceTimeoutDefaults(): string {
  const macos = TALK_SILENCE_TIMEOUT_MS_BY_PLATFORM.macos;
  const ios = TALK_SILENCE_TIMEOUT_MS_BY_PLATFORM.ios;
  return `${macos} ms on macOS and Android, ${ios} ms on iOS`;
}
