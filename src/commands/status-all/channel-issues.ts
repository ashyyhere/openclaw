// Groups channel diagnostics so status-all can overlay them onto table rows.
/** Reused helper for group Channel Issues By Channel behavior in src/commands/status-all. */
export function groupChannelIssuesByChannel<T extends { channel: string }>(
  issues: readonly T[],
): Map<string, T[]> {
  const byChannel = new Map<string, T[]>();
  for (const issue of issues) {
    const key = issue.channel;
    const list = byChannel.get(key);
    if (list) {
      list.push(issue);
    } else {
      byChannel.set(key, [issue]);
    }
  }
  return byChannel;
}
