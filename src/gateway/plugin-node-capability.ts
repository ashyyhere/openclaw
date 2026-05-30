// Gateway helpers for scoped plugin node capability URLs and tokens.
import { randomBytes } from "node:crypto";
import { safeEqualSecret } from "../security/secret-equal.js";
import {
  asDateTimestampMs,
  asPositiveSafeInteger,
  isFutureDateTimestampMs,
  resolveExpiresAtMsFromDurationMs,
} from "../shared/number-coercion.js";

/** URL path marker used to carry plugin node capability tokens. */
export const PLUGIN_NODE_CAPABILITY_PATH_PREFIX = "/__openclaw__/cap";
const PLUGIN_NODE_CAPABILITY_QUERY_PARAM = "oc_cap";
/** Default lifetime for a minted plugin node capability token. */
export const DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS = 10 * 60_000;

/** Plugin surface that requires gateway-scoped node capability authorization. */
export type PluginNodeCapabilitySurface = {
  surface: string;
  ttlMs?: number;
  scopeKey?: string;
};

/** Gateway client state that tracks plugin surface URLs and active capabilities. */
export type PluginNodeCapabilityClient = {
  pluginSurfaceUrls?: Record<string, string>;
  pluginNodeCapabilitySurfaces?: Record<string, PluginNodeCapabilitySurface>;
  pluginNodeCapabilities?: Record<string, { capability: string; expiresAtMs: number }>;
};

/** Indexes capability surfaces by normalized surface, keeping the shortest TTL. */
export function indexPluginNodeCapabilitySurfaces(
  surfaces: readonly PluginNodeCapabilitySurface[],
): Record<string, PluginNodeCapabilitySurface> {
  const indexed: Record<string, PluginNodeCapabilitySurface> = {};
  for (const entry of surfaces) {
    const surface = normalizeSurface(entry.surface);
    if (!surface) {
      continue;
    }
    const existing = indexed[surface];
    const next = { ...entry, surface };
    if (
      !existing ||
      resolvePluginNodeCapabilityTtlMs(next) < resolvePluginNodeCapabilityTtlMs(existing)
    ) {
      indexed[surface] = next;
    }
  }
  return indexed;
}

/** Parsed plugin node capability URL with extracted and rewritten path details. */
export type NormalizedPluginNodeCapabilityUrl = {
  pathname: string;
  capability?: string;
  rewrittenUrl?: string;
  scopedPath: boolean;
  malformedScopedPath: boolean;
};

function normalizeCapability(raw: string | null | undefined) {
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeSurface(raw: string | undefined) {
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

function resolvePluginNodeCapabilityStorageKey(surface: PluginNodeCapabilitySurface) {
  const normalizedSurface = normalizeSurface(surface.surface);
  if (!normalizedSurface) {
    return undefined;
  }
  const scopeKey = surface.scopeKey?.trim();
  return scopeKey ? `${normalizedSurface}\0${scopeKey}` : normalizedSurface;
}

/** Resolves a positive surface TTL or falls back to the default capability lifetime. */
export function resolvePluginNodeCapabilityTtlMs(surface: PluginNodeCapabilitySurface) {
  return asPositiveSafeInteger(surface.ttlMs) ?? DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS;
}

export function resolvePluginNodeCapabilityExpiresAtMs(
  surface: PluginNodeCapabilitySurface,
  nowMs: number = Date.now(),
): number | undefined {
  return resolveExpiresAtMsFromDurationMs(resolvePluginNodeCapabilityTtlMs(surface), { nowMs });
}

/** Mints a URL-safe random token for plugin node capability checks. */
export function mintPluginNodeCapabilityToken(): string {
  return randomBytes(18).toString("base64url");
}

/** Adds a capability path segment to a plugin host URL and strips query/hash data. */
export function buildPluginNodeCapabilityScopedHostUrl(
  baseUrl: string,
  capability: string,
): string | undefined {
  const normalizedCapability = normalizeCapability(capability);
  if (!normalizedCapability) {
    return undefined;
  }
  try {
    const url = new URL(baseUrl);
    const trimmedPath = url.pathname.replace(/\/+$/, "");
    const prefix = `${PLUGIN_NODE_CAPABILITY_PATH_PREFIX}/${encodeURIComponent(normalizedCapability)}`;
    url.pathname = `${trimmedPath}${prefix}`;
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

/** Replaces an existing scoped capability token or adds one to an unscoped URL. */
export function replacePluginNodeCapabilityInScopedHostUrl(
  scopedUrl: string,
  capability: string,
): string | undefined {
  const normalizedCapability = normalizeCapability(capability);
  if (!normalizedCapability) {
    return undefined;
  }
  try {
    const url = new URL(scopedUrl);
    const prefix = `${PLUGIN_NODE_CAPABILITY_PATH_PREFIX}/`;
    const markerStart = url.pathname.indexOf(prefix);
    if (markerStart < 0) {
      return buildPluginNodeCapabilityScopedHostUrl(scopedUrl, normalizedCapability);
    }
    const capabilityStart = markerStart + prefix.length;
    const nextSlashIndex = url.pathname.indexOf("/", capabilityStart);
    const capabilityEnd = nextSlashIndex >= 0 ? nextSlashIndex : url.pathname.length;
    if (capabilityEnd <= capabilityStart) {
      return undefined;
    }
    url.pathname =
      url.pathname.slice(0, capabilityStart) +
      encodeURIComponent(normalizedCapability) +
      url.pathname.slice(capabilityEnd);
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

/** Extracts capability data from scoped paths or legacy query parameters. */
export function normalizePluginNodeCapabilityScopedUrl(
  rawUrl: string,
): NormalizedPluginNodeCapabilityUrl {
  let url: URL;
  try {
    url = new URL(rawUrl, "http://localhost");
  } catch {
    return {
      pathname: "/",
      scopedPath: false,
      malformedScopedPath: true,
    };
  }
  const prefix = `${PLUGIN_NODE_CAPABILITY_PATH_PREFIX}/`;
  let scopedPath = false;
  let malformedScopedPath = false;
  let capabilityFromPath: string | undefined;
  let rewrittenUrl: string | undefined;

  if (url.pathname.startsWith(prefix)) {
    scopedPath = true;
    const remainder = url.pathname.slice(prefix.length);
    const slashIndex = remainder.indexOf("/");
    if (slashIndex <= 0) {
      malformedScopedPath = true;
    } else {
      const encodedCapability = remainder.slice(0, slashIndex);
      const canonicalPath = remainder.slice(slashIndex) || "/";
      let decoded: string | undefined;
      try {
        decoded = decodeURIComponent(encodedCapability);
      } catch {
        malformedScopedPath = true;
      }
      capabilityFromPath = normalizeCapability(decoded);
      if (!capabilityFromPath || !canonicalPath.startsWith("/")) {
        malformedScopedPath = true;
      } else {
        url.pathname = canonicalPath;
        if (!url.searchParams.has(PLUGIN_NODE_CAPABILITY_QUERY_PARAM)) {
          url.searchParams.set(PLUGIN_NODE_CAPABILITY_QUERY_PARAM, capabilityFromPath);
        }
        rewrittenUrl = `${url.pathname}${url.search}`;
      }
    }
  }

  const capability =
    capabilityFromPath ??
    normalizeCapability(url.searchParams.get(PLUGIN_NODE_CAPABILITY_QUERY_PARAM));
  return {
    pathname: url.pathname,
    capability,
    rewrittenUrl,
    scopedPath,
    malformedScopedPath,
  };
}

/** Stores an active plugin node capability on a gateway client. */
export function setClientPluginNodeCapability(params: {
  client: PluginNodeCapabilityClient;
  surface: PluginNodeCapabilitySurface;
  capability: string;
  expiresAtMs: number;
}) {
  const surface = normalizeSurface(params.surface.surface);
  const storageKey = resolvePluginNodeCapabilityStorageKey(params.surface);
  const expiresAtMs = asDateTimestampMs(params.expiresAtMs);
  if (!surface || !storageKey || expiresAtMs === undefined) {
    return;
  }
  params.client.pluginNodeCapabilities ??= {};
  params.client.pluginNodeCapabilities[storageKey] = {
    capability: params.capability,
    expiresAtMs,
  };
}

/** Refreshes a client's plugin surface URL with a newly minted capability token. */
export function refreshClientPluginNodeCapability(params: {
  client: PluginNodeCapabilityClient;
  surface: PluginNodeCapabilitySurface;
  nowMs?: number;
}):
  | {
      surface: string;
      capability: string;
      expiresAtMs: number;
      scopedUrl: string;
    }
  | undefined {
  const surface = normalizeSurface(params.surface.surface);
  if (!surface) {
    return undefined;
  }
  const existingUrl = params.client.pluginSurfaceUrls?.[surface];
  if (!existingUrl) {
    return undefined;
  }
  const capabilitySurface = params.client.pluginNodeCapabilitySurfaces?.[surface] ?? params.surface;
  const capability = mintPluginNodeCapabilityToken();
  const nowMs = params.nowMs ?? Date.now();
  const expiresAtMs = resolvePluginNodeCapabilityExpiresAtMs(capabilitySurface, nowMs);
  if (expiresAtMs === undefined) {
    return undefined;
  }
  const scopedUrl = replacePluginNodeCapabilityInScopedHostUrl(existingUrl, capability);
  if (!scopedUrl) {
    return undefined;
  }
  params.client.pluginSurfaceUrls ??= {};
  params.client.pluginSurfaceUrls[surface] = scopedUrl;
  setClientPluginNodeCapability({
    client: params.client,
    surface: capabilitySurface,
    capability,
    expiresAtMs,
  });
  return {
    surface,
    capability,
    expiresAtMs,
    scopedUrl,
  };
}

/** Checks a presented capability token against connected clients and extends its TTL. */
export function hasAuthorizedPluginNodeCapability(params: {
  clients: Iterable<PluginNodeCapabilityClient>;
  surface: PluginNodeCapabilitySurface;
  capability: string;
  nowMs?: number;
}) {
  const surface = normalizeSurface(params.surface.surface);
  const storageKey = resolvePluginNodeCapabilityStorageKey(params.surface);
  if (!surface || !storageKey) {
    return false;
  }
  const nowMs = params.nowMs ?? Date.now();
  const nextExpiresAtMs = resolvePluginNodeCapabilityExpiresAtMs(params.surface, nowMs);
  if (nextExpiresAtMs === undefined) {
    return false;
  }
  for (const client of params.clients) {
    const entry = client.pluginNodeCapabilities?.[storageKey];
    if (!entry || !isFutureDateTimestampMs(entry.expiresAtMs, { nowMs })) {
      continue;
    }
    if (safeEqualSecret(entry.capability, params.capability)) {
      entry.expiresAtMs = nextExpiresAtMs;
      return true;
    }
  }
  return false;
}
