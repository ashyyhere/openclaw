// Shared mutation helper for rejecting pending pairing records in state files.
type PendingState<TPending> = {
  pendingById: Record<string, TPending>;
};

/** Removes one pending pairing request and returns its caller-selected id field. */
export async function rejectPendingPairingRequest<
  TPending,
  TState extends PendingState<TPending>,
  TIdKey extends string,
>(params: {
  requestId: string;
  idKey: TIdKey;
  loadState: () => Promise<TState>;
  persistState: (state: TState) => Promise<void>;
  getId: (pending: TPending) => string;
}): Promise<({ requestId: string } & Record<TIdKey, string>) | null> {
  const state = await params.loadState();
  const pending = state.pendingById[params.requestId];
  if (!pending) {
    return null;
  }
  delete state.pendingById[params.requestId];
  await params.persistState(state);
  return {
    requestId: params.requestId,
    [params.idKey]: params.getId(pending),
  } as { requestId: string } & Record<TIdKey, string>;
}
