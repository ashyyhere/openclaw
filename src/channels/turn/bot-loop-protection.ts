/** Bot-loop guard integration for channel message turns. */
import {
  createPairLoopGuard,
  resolvePairLoopGuardSettings,
  type PairLoopGuardConfig,
  type PairLoopGuardResult,
  type PairLoopGuardSnapshotEntry,
} from "../../plugin-sdk/pair-loop-guard-runtime.js";

/** Shared type for Channel Bot Loop Protection Facts in src/channels/turn. */
export type ChannelBotLoopProtectionFacts = {
  scopeId: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  config?: PairLoopGuardConfig;
  defaultsConfig?: PairLoopGuardConfig;
  defaultEnabled: boolean;
  nowMs?: number;
};

const channelBotPairLoopGuard = createPairLoopGuard({ pruneIntervalMs: 60_000 });

/** Reused helper for record Channel Bot Pair Loop And Check Suppression behavior in src/channels/turn. */
export function recordChannelBotPairLoopAndCheckSuppression(
  params: ChannelBotLoopProtectionFacts,
): PairLoopGuardResult {
  return channelBotPairLoopGuard.recordAndCheck({
    scopeId: params.scopeId,
    conversationId: params.conversationId,
    senderId: params.senderId,
    receiverId: params.receiverId,
    settings: resolvePairLoopGuardSettings({
      config: params.config,
      defaultsConfig: params.defaultsConfig,
      defaultEnabled: params.defaultEnabled,
    }),
    nowMs: params.nowMs,
  });
}

/** Reused helper for clear Channel Bot Pair Loop Guard For Tests behavior in src/channels/turn. */
export function clearChannelBotPairLoopGuardForTests(): void {
  channelBotPairLoopGuard.clear();
}

/** Reused helper for list Tracked Channel Bot Pairs For Tests behavior in src/channels/turn. */
export function listTrackedChannelBotPairsForTests(): PairLoopGuardSnapshotEntry[] {
  return channelBotPairLoopGuard.snapshot();
}
