// QA Lab CLI option helpers normalize repeated string flags.
/** Commander collector for repeatable non-empty string options. */
export function collectString(value: string, previous: string[]) {
  const trimmed = value.trim();
  return trimmed ? [...previous, trimmed] : previous;
}
