/** Classifies Docker network modes for sandbox safety policy. */
import { normalizeOptionalLowercaseString } from "../../shared/string-coerce.js";

/** Shared type for Network Mode Block Reason in src/agents/sandbox. */
export type NetworkModeBlockReason = "host" | "container_namespace_join";

/** Normalizes a configured Docker network mode. */
export function normalizeNetworkMode(network: string | undefined): string | undefined {
  const normalized = normalizeOptionalLowercaseString(network);
  return normalized || undefined;
}

/** Returns the reason a network mode is blocked, if any. */
export function getBlockedNetworkModeReason(params: {
  network: string | undefined;
  allowContainerNamespaceJoin?: boolean;
}): NetworkModeBlockReason | null {
  const normalized = normalizeNetworkMode(params.network);
  if (!normalized) {
    return null;
  }
  if (normalized === "host") {
    return "host";
  }
  if (normalized.startsWith("container:") && params.allowContainerNamespaceJoin !== true) {
    return "container_namespace_join";
  }
  return null;
}

/** Checks whether a network mode grants host/container namespace access. */
export function isDangerousNetworkMode(network: string | undefined): boolean {
  const normalized = normalizeNetworkMode(network);
  return normalized === "host" || normalized?.startsWith("container:") === true;
}
