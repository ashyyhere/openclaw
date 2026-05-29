// gateway/server/plugins-http route capability helpers and runtime behavior.
import type { PluginRegistry } from "../../../plugins/registry.js";
import {
  resolvePluginNodeCapabilityTtlMs,
  type PluginNodeCapabilitySurface,
} from "../../plugin-node-capability.js";
import type { PluginRoutePathContext } from "./path-context.js";
import { findMatchingPluginHttpRoutes } from "./route-match.js";

type PluginHttpRouteEntry = NonNullable<PluginRegistry["httpRoutes"]>[number];

/** Shared type for Plugin Node Capability Route in src/gateway/server. */
export type PluginNodeCapabilityRoute = PluginHttpRouteEntry & {
  nodeCapability: PluginNodeCapabilitySurface;
};

function hasNodeCapabilityRoute(route: PluginHttpRouteEntry): route is PluginNodeCapabilityRoute {
  return Boolean(route.nodeCapability?.surface?.trim());
}

function resolvePluginNodeCapabilityRouteSurface(
  route: PluginNodeCapabilityRoute,
): PluginNodeCapabilitySurface {
  const surface = route.nodeCapability.surface.trim();
  const owner = route.pluginId?.trim() || route.source?.trim();
  return {
    ...route.nodeCapability,
    surface,
    ...(owner ? { scopeKey: `${owner}:${surface}` } : {}),
  };
}

/** Reused helper for find Matching Plugin Node Capability Routes behavior in src/gateway/server. */
export function findMatchingPluginNodeCapabilityRoutes(
  registry: PluginRegistry,
  context: PluginRoutePathContext,
): PluginNodeCapabilityRoute[] {
  return findMatchingPluginHttpRoutes(registry, context)
    .filter(hasNodeCapabilityRoute)
    .map((route) =>
      Object.assign({}, route, {
        nodeCapability: resolvePluginNodeCapabilityRouteSurface(route),
      }),
    );
}

/** Reused helper for find Matching Plugin Node Capability Route behavior in src/gateway/server. */
export function findMatchingPluginNodeCapabilityRoute(
  registry: PluginRegistry,
  context: PluginRoutePathContext,
): PluginNodeCapabilityRoute | undefined {
  return findMatchingPluginNodeCapabilityRoutes(registry, context)[0];
}

/** Reused helper for list Plugin Node Capability Surfaces behavior in src/gateway/server. */
export function listPluginNodeCapabilitySurfaces(registry: PluginRegistry): string[] {
  return listPluginNodeCapabilities(registry).map((entry) => entry.surface);
}

/** Reused helper for list Plugin Node Capabilities behavior in src/gateway/server. */
export function listPluginNodeCapabilities(
  registry: PluginRegistry,
): PluginNodeCapabilitySurface[] {
  const surfaces = new Map<string, PluginNodeCapabilitySurface>();
  for (const route of registry.httpRoutes ?? []) {
    const surface = route.nodeCapability?.surface?.trim();
    if (surface) {
      const next = resolvePluginNodeCapabilityRouteSurface(route as PluginNodeCapabilityRoute);
      const existing = surfaces.get(surface);
      if (!existing || resolveTtlMs(next) < resolveTtlMs(existing)) {
        surfaces.set(surface, next);
      }
    }
  }
  return [...surfaces.values()].toSorted((a, b) => a.surface.localeCompare(b.surface));
}

function resolveTtlMs(surface: PluginNodeCapabilitySurface) {
  return resolvePluginNodeCapabilityTtlMs(surface);
}
