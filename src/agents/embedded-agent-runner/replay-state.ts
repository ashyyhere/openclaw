/** Tracks replay history metadata observed during embedded-agent attempts. */
export type EmbeddedRunReplayState = {
  replayInvalid: boolean;
  hadPotentialSideEffects: boolean;
};

/** Shared type for Embedded Run Replay Metadata in src/agents/embedded-agent-runner. */
export type EmbeddedRunReplayMetadata = {
  hadPotentialSideEffects: boolean;
  replaySafe: boolean;
};

/** Reused helper for create Embedded Run Replay State behavior in src/agents/embedded-agent-runner. */
export function createEmbeddedRunReplayState(
  state?: Partial<EmbeddedRunReplayState>,
): EmbeddedRunReplayState {
  return {
    replayInvalid: state?.replayInvalid === true,
    hadPotentialSideEffects: state?.hadPotentialSideEffects === true,
  };
}

/** Reused helper for merge Embedded Run Replay State behavior in src/agents/embedded-agent-runner. */
export function mergeEmbeddedRunReplayState(
  current: EmbeddedRunReplayState,
  next?: Partial<EmbeddedRunReplayState>,
): EmbeddedRunReplayState {
  if (!next) {
    return current;
  }
  return {
    replayInvalid: current.replayInvalid || next.replayInvalid === true,
    hadPotentialSideEffects:
      current.hadPotentialSideEffects || next.hadPotentialSideEffects === true,
  };
}

/** Reused helper for observe Replay Metadata behavior in src/agents/embedded-agent-runner. */
export function observeReplayMetadata(
  current: EmbeddedRunReplayState,
  metadata?: EmbeddedRunReplayMetadata | null,
): EmbeddedRunReplayState {
  if (!metadata) {
    return mergeEmbeddedRunReplayState(current, {
      replayInvalid: true,
      hadPotentialSideEffects: true,
    });
  }
  return mergeEmbeddedRunReplayState(current, {
    replayInvalid: !metadata.replaySafe,
    hadPotentialSideEffects: metadata.hadPotentialSideEffects,
  });
}

/** Reused helper for replay Metadata From State behavior in src/agents/embedded-agent-runner. */
export function replayMetadataFromState(state: EmbeddedRunReplayState): EmbeddedRunReplayMetadata {
  return {
    hadPotentialSideEffects: state.hadPotentialSideEffects,
    replaySafe: !state.replayInvalid && !state.hadPotentialSideEffects,
  };
}
