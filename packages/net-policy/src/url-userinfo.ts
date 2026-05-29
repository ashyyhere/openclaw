// packages/net-policy/src url userinfo helpers and runtime behavior.
/** Public helper for strip Url User Info behavior in packages/net-policy. */
export function stripUrlUserInfo(value: string): string {
  try {
    const parsed = new URL(value);
    if (!parsed.username && !parsed.password) {
      return value;
    }
    parsed.username = "";
    parsed.password = "";
    return parsed.toString();
  } catch {
    return value;
  }
}
