// gateway/methods descriptor helpers and runtime behavior.
import type { OperatorScope } from "../operator-scopes.js";

/** Reused constant for NODE GATEWAY METHOD SCOPE behavior in src/gateway/methods. */
export const NODE_GATEWAY_METHOD_SCOPE = "node" as const;
/** Reused constant for DYNAMIC GATEWAY METHOD SCOPE behavior in src/gateway/methods. */
export const DYNAMIC_GATEWAY_METHOD_SCOPE = "dynamic" as const;

/** Shared type for Gateway Method Scope in src/gateway/methods. */
export type GatewayMethodScope =
  | OperatorScope
  | typeof NODE_GATEWAY_METHOD_SCOPE
  | typeof DYNAMIC_GATEWAY_METHOD_SCOPE;

/** Shared type for Gateway Method Owner in src/gateway/methods. */
export type GatewayMethodOwner =
  | { kind: "core"; area: string }
  | { kind: "plugin"; pluginId: string }
  | { kind: "channel"; channelId: string }
  | { kind: "aux"; area: string };

/** Shared type for Gateway Method Startup Availability in src/gateway/methods. */
export type GatewayMethodStartupAvailability = "available" | "unavailable-until-sidecars";

/** Shared type for Gateway Method Handler in src/gateway/methods. */
export type GatewayMethodHandler = (opts: never) => unknown;

/** Shared type for Gateway Method Descriptor in src/gateway/methods. */
export type GatewayMethodDescriptor = {
  name: string;
  handler: GatewayMethodHandler;
  scope: GatewayMethodScope;
  owner: GatewayMethodOwner;
  startup?: GatewayMethodStartupAvailability;
  controlPlaneWrite?: boolean;
  advertise?: boolean;
  description?: string;
};

/** Shared type for Gateway Method Descriptor Input in src/gateway/methods. */
export type GatewayMethodDescriptorInput = Omit<GatewayMethodDescriptor, "name"> & {
  name: string;
};

/** Shared type for Gateway Method Registry View in src/gateway/methods. */
export type GatewayMethodRegistryView = {
  getHandler: (name: string) => GatewayMethodHandler | undefined;
  listMethods: () => string[];
  listAdvertisedMethods: () => string[];
  getScope: (name: string) => GatewayMethodScope | undefined;
  isStartupUnavailable: (name: string) => boolean;
  isControlPlaneWrite: (name: string) => boolean;
  descriptors: () => readonly GatewayMethodDescriptor[];
};
