/** Tracks replay history metadata observed during embedded-agent attempts. */
export type EmbeddedRunReplayState = {
  replayInvalid: boolean;
  hadPotentialSideEffects: boolean;
};

/** Replay safety metadata emitted by an embedded-agent attempt. */
export type EmbeddedRunReplayMetadata = {
  hadPotentialSideEffects: boolean;
  replaySafe: boolean;
};

/** Creates replay state with missing flags defaulting to the conservative safe values. */
export function createEmbeddedRunReplayState(
  state?: Partial<EmbeddedRunReplayState>,
): EmbeddedRunReplayState {
  return {
    replayInvalid: state?.replayInvalid === true,
    hadPotentialSideEffects: state?.hadPotentialSideEffects === true,
  };
}

/** Merges replay observations without ever clearing an earlier unsafe signal. */
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

/** Records attempt metadata, treating missing metadata as unsafe to replay. */
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

/** Converts accumulated replay state back to the attempt metadata shape. */
export function replayMetadataFromState(state: EmbeddedRunReplayState): EmbeddedRunReplayMetadata {
  return {
    hadPotentialSideEffects: state.hadPotentialSideEffects,
    replaySafe: !state.replayInvalid && !state.hadPotentialSideEffects,
  };
}
