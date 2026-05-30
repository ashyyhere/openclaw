// Gateway method descriptor contracts for registry ownership and scopes.
import type { OperatorScope } from "../operator-scopes.js";

/** Scope marker for node-owned gateway methods. */
export const NODE_GATEWAY_METHOD_SCOPE = "node" as const;
/** Scope marker for dynamically registered gateway methods. */
export const DYNAMIC_GATEWAY_METHOD_SCOPE = "dynamic" as const;

/** Access scope attached to a registered gateway method. */
export type GatewayMethodScope =
  | OperatorScope
  | typeof NODE_GATEWAY_METHOD_SCOPE
  | typeof DYNAMIC_GATEWAY_METHOD_SCOPE;

/** Owning surface for a gateway method descriptor. */
export type GatewayMethodOwner =
  | { kind: "core"; area: string }
  | { kind: "plugin"; pluginId: string }
  | { kind: "channel"; channelId: string }
  | { kind: "aux"; area: string };

/** Startup availability state for methods depending on sidecars. */
export type GatewayMethodStartupAvailability = "available" | "unavailable-until-sidecars";

/** Runtime handler stored in the gateway method registry. */
export type GatewayMethodHandler = (opts: never) => unknown;

/** Full registry descriptor for one gateway method. */
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

/** Descriptor input accepted before registry normalization. */
export type GatewayMethodDescriptorInput = Omit<GatewayMethodDescriptor, "name"> & {
  name: string;
};

/** Read-only gateway method registry view used by routing and discovery. */
export type GatewayMethodRegistryView = {
  getHandler: (name: string) => GatewayMethodHandler | undefined;
  listMethods: () => string[];
  listAdvertisedMethods: () => string[];
  getScope: (name: string) => GatewayMethodScope | undefined;
  isStartupUnavailable: (name: string) => boolean;
  isControlPlaneWrite: (name: string) => boolean;
  descriptors: () => readonly GatewayMethodDescriptor[];
};
