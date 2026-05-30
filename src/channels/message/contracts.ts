// Channel message capability contract proof helpers.
import type {
  ChannelMessageAdapterShape,
  ChannelMessageLiveCapability,
  ChannelMessageReceiveAckPolicy,
  DurableFinalDeliveryCapability,
  DurableFinalDeliveryRequirementMap,
  LivePreviewFinalizerCapability,
  LivePreviewFinalizerCapabilityMap,
} from "./types.js";
import {
  channelMessageLiveCapabilities,
  channelMessageReceiveAckPolicies,
  durableFinalDeliveryCapabilities,
  livePreviewFinalizerCapabilities,
} from "./types.js";

/** Proof callback that validates a declared durable-final delivery capability. */
export type DurableFinalCapabilityProof = () => Promise<void> | void;

/** Proof callbacks keyed by durable-final delivery capability. */
export type DurableFinalCapabilityProofMap = Partial<
  Record<DurableFinalDeliveryCapability, DurableFinalCapabilityProof>
>;

/** Verification result for one durable-final delivery capability. */
export type DurableFinalCapabilityProofResult = {
  capability: DurableFinalDeliveryCapability;
  status: "verified" | "not_declared";
};

/** Proof callback that validates a live preview finalizer capability. */
export type LivePreviewFinalizerCapabilityProof = () => Promise<void> | void;

/** Proof callback that validates a live channel message capability. */
export type ChannelMessageLiveCapabilityProof = () => Promise<void> | void;

/** Proof callback that validates a receive acknowledgement policy. */
export type ChannelMessageReceiveAckPolicyProof = () => Promise<void> | void;

/** Proof callbacks keyed by live preview finalizer capability. */
export type LivePreviewFinalizerCapabilityProofMap = Partial<
  Record<LivePreviewFinalizerCapability, LivePreviewFinalizerCapabilityProof>
>;

/** Proof callbacks keyed by live channel message capability. */
export type ChannelMessageLiveCapabilityProofMap = Partial<
  Record<ChannelMessageLiveCapability, ChannelMessageLiveCapabilityProof>
>;

/** Proof callbacks keyed by receive acknowledgement policy. */
export type ChannelMessageReceiveAckPolicyProofMap = Partial<
  Record<ChannelMessageReceiveAckPolicy, ChannelMessageReceiveAckPolicyProof>
>;

/** Verification result for one live preview finalizer capability. */
export type LivePreviewFinalizerCapabilityProofResult = {
  capability: LivePreviewFinalizerCapability;
  status: "verified" | "not_declared";
};

/** Verification result for one live channel message capability. */
export type ChannelMessageLiveCapabilityProofResult = {
  capability: ChannelMessageLiveCapability;
  status: "verified" | "not_declared";
};

/** Verification result for one receive acknowledgement policy. */
export type ChannelMessageReceiveAckPolicyProofResult = {
  policy: ChannelMessageReceiveAckPolicy;
  status: "verified" | "not_declared";
};

/** Lists durable-final capabilities explicitly declared by an adapter. */
export function listDeclaredDurableFinalCapabilities(
  capabilities: DurableFinalDeliveryRequirementMap | undefined,
): DurableFinalDeliveryCapability[] {
  return durableFinalDeliveryCapabilities.filter(
    (capability) => capabilities?.[capability] === true,
  );
}

/** Lists live preview finalizer capabilities explicitly declared by an adapter. */
export function listDeclaredLivePreviewFinalizerCapabilities(
  capabilities: LivePreviewFinalizerCapabilityMap | undefined,
): LivePreviewFinalizerCapability[] {
  return livePreviewFinalizerCapabilities.filter(
    (capability) => capabilities?.[capability] === true,
  );
}

/** Lists live message capabilities explicitly declared by an adapter. */
export function listDeclaredChannelMessageLiveCapabilities(
  capabilities: Partial<Record<ChannelMessageLiveCapability, boolean>> | undefined,
): ChannelMessageLiveCapability[] {
  return channelMessageLiveCapabilities.filter((capability) => capabilities?.[capability] === true);
}

/** Lists receive acknowledgement policies supported by an adapter. */
export function listDeclaredReceiveAckPolicies(
  receive: ChannelMessageAdapterShape["receive"] | undefined,
): ChannelMessageReceiveAckPolicy[] {
  const declared = receive?.supportedAckPolicies?.length
    ? receive.supportedAckPolicies
    : receive?.defaultAckPolicy
      ? [receive.defaultAckPolicy]
      : [];
  return channelMessageReceiveAckPolicies.filter((policy) => declared.includes(policy));
}

/** Runs proofs for declared durable-final capabilities and fails on missing proofs. */
export async function verifyDurableFinalCapabilityProofs(params: {
  adapterName: string;
  capabilities?: DurableFinalDeliveryRequirementMap;
  proofs: DurableFinalCapabilityProofMap;
}): Promise<DurableFinalCapabilityProofResult[]> {
  const results: DurableFinalCapabilityProofResult[] = [];
  for (const capability of durableFinalDeliveryCapabilities) {
    if (params.capabilities?.[capability] !== true) {
      results.push({ capability, status: "not_declared" });
      continue;
    }
    const proof = params.proofs[capability];
    if (!proof) {
      throw new Error(
        `${params.adapterName} declares durable final capability "${capability}" without a contract proof`,
      );
    }
    await proof();
    results.push({ capability, status: "verified" });
  }
  return results;
}

/** Runs proofs for declared live preview finalizer capabilities. */
export async function verifyLivePreviewFinalizerCapabilityProofs(params: {
  adapterName: string;
  capabilities?: LivePreviewFinalizerCapabilityMap;
  proofs: LivePreviewFinalizerCapabilityProofMap;
}): Promise<LivePreviewFinalizerCapabilityProofResult[]> {
  const results: LivePreviewFinalizerCapabilityProofResult[] = [];
  for (const capability of livePreviewFinalizerCapabilities) {
    if (params.capabilities?.[capability] !== true) {
      results.push({ capability, status: "not_declared" });
      continue;
    }
    const proof = params.proofs[capability];
    if (!proof) {
      throw new Error(
        `${params.adapterName} declares live preview finalizer capability "${capability}" without a contract proof`,
      );
    }
    await proof();
    results.push({ capability, status: "verified" });
  }
  return results;
}

/** Runs proofs for declared live channel message capabilities. */
export async function verifyChannelMessageLiveCapabilityProofs(params: {
  adapterName: string;
  capabilities?: Partial<Record<ChannelMessageLiveCapability, boolean>>;
  proofs: ChannelMessageLiveCapabilityProofMap;
}): Promise<ChannelMessageLiveCapabilityProofResult[]> {
  const results: ChannelMessageLiveCapabilityProofResult[] = [];
  for (const capability of channelMessageLiveCapabilities) {
    if (params.capabilities?.[capability] !== true) {
      results.push({ capability, status: "not_declared" });
      continue;
    }
    const proof = params.proofs[capability];
    if (!proof) {
      throw new Error(
        `${params.adapterName} declares live capability "${capability}" without a contract proof`,
      );
    }
    await proof();
    results.push({ capability, status: "verified" });
  }
  return results;
}

/** Runs proofs for declared receive acknowledgement policies. */
export async function verifyChannelMessageReceiveAckPolicyProofs(params: {
  adapterName: string;
  receive?: ChannelMessageAdapterShape["receive"];
  proofs: ChannelMessageReceiveAckPolicyProofMap;
}): Promise<ChannelMessageReceiveAckPolicyProofResult[]> {
  const declared = new Set(listDeclaredReceiveAckPolicies(params.receive));
  const results: ChannelMessageReceiveAckPolicyProofResult[] = [];
  for (const policy of channelMessageReceiveAckPolicies) {
    if (!declared.has(policy)) {
      results.push({ policy, status: "not_declared" });
      continue;
    }
    const proof = params.proofs[policy];
    if (!proof) {
      throw new Error(
        `${params.adapterName} declares receive ack policy "${policy}" without a contract proof`,
      );
    }
    await proof();
    results.push({ policy, status: "verified" });
  }
  return results;
}

/** Verifies durable-final capability proofs against a channel message adapter. */
export async function verifyChannelMessageAdapterCapabilityProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "durableFinal">;
  proofs: DurableFinalCapabilityProofMap;
}): Promise<DurableFinalCapabilityProofResult[]> {
  return await verifyDurableFinalCapabilityProofs({
    adapterName: params.adapterName,
    capabilities: params.adapter.durableFinal?.capabilities,
    proofs: params.proofs,
  });
}

/** Verifies receive acknowledgement policy proofs against an adapter. */
export async function verifyChannelMessageReceiveAckPolicyAdapterProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "receive">;
  proofs: ChannelMessageReceiveAckPolicyProofMap;
}): Promise<ChannelMessageReceiveAckPolicyProofResult[]> {
  return await verifyChannelMessageReceiveAckPolicyProofs({
    adapterName: params.adapterName,
    receive: params.adapter.receive,
    proofs: params.proofs,
  });
}

/** Verifies live finalizer capability proofs against an adapter. */
export async function verifyChannelMessageLiveFinalizerProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "live">;
  proofs: LivePreviewFinalizerCapabilityProofMap;
}): Promise<LivePreviewFinalizerCapabilityProofResult[]> {
  return await verifyLivePreviewFinalizerCapabilityProofs({
    adapterName: params.adapterName,
    capabilities: params.adapter.live?.finalizer?.capabilities,
    proofs: params.proofs,
  });
}

/** Verifies live channel capability proofs against an adapter. */
export async function verifyChannelMessageLiveCapabilityAdapterProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "live">;
  proofs: ChannelMessageLiveCapabilityProofMap;
}): Promise<ChannelMessageLiveCapabilityProofResult[]> {
  return await verifyChannelMessageLiveCapabilityProofs({
    adapterName: params.adapterName,
    capabilities: params.adapter.live?.capabilities,
    proofs: params.proofs,
  });
}
