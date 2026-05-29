/** Helpers for producing unresolved target results from adapter lookups. */
import type { ChannelResolveResult } from "./types.adapters.js";

/** Reused helper for build Unresolved Target Results behavior in src/channels/plugins. */
export function buildUnresolvedTargetResults(
  inputs: string[],
  note: string,
): ChannelResolveResult[] {
  return inputs.map((input) => ({
    input,
    resolved: false,
    note,
  }));
}

/** Reused helper for resolve Targets With Optional Token behavior in src/channels/plugins. */
export async function resolveTargetsWithOptionalToken<TResult>(params: {
  token?: string | null;
  inputs: string[];
  missingTokenNote: string;
  resolveWithToken: (params: { token: string; inputs: string[] }) => Promise<TResult[]>;
  mapResolved: (entry: TResult) => ChannelResolveResult;
}): Promise<ChannelResolveResult[]> {
  const token = params.token?.trim();
  if (!token) {
    return buildUnresolvedTargetResults(params.inputs, params.missingTokenNote);
  }
  const resolved = await params.resolveWithToken({
    token,
    inputs: params.inputs,
  });
  return resolved.map(params.mapResolved);
}
