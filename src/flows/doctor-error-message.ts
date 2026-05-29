// Doctor-safe error message normalization for display and structured findings.
const ERR_MESSAGE_MAX_LEN = 256;

/** Strip control characters and cap error text before showing doctor output. */
export function scrubDoctorErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  let stripped = "";
  for (let index = 0; index < raw.length; index++) {
    const code = raw.charCodeAt(index);
    if (code > 0x1f && code !== 0x7f) {
      stripped += raw.charAt(index);
    }
  }
  if (stripped.length <= ERR_MESSAGE_MAX_LEN) {
    return stripped;
  }
  return `${stripped.slice(0, ERR_MESSAGE_MAX_LEN - 3)}...`;
}
