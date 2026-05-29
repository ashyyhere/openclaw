// routing binding scope helpers and runtime behavior.
import { normalizeChatChannelId } from "../channels/ids.js";
import type { AgentRouteBinding } from "../config/types.agents.js";
import { normalizeLowercaseStringOrEmpty } from "../shared/string-coerce.js";
import { normalizeAccountId, normalizeAgentId } from "./session-key.js";

/** Shared type for Route Binding Scope Constraint in src/routing. */
export type RouteBindingScopeConstraint = {
  guildId?: string | null;
  teamId?: string | null;
  roles?: string[] | null;
};

/** Shared type for Route Binding Scope in src/routing. */
export type RouteBindingScope = {
  guildId?: string | null;
  teamId?: string | null;
  groupSpace?: string | null;
  memberRoleIds?: Iterable<string> | null;
};

/** Shared type for Normalized Route Binding Match in src/routing. */
export type NormalizedRouteBindingMatch = {
  agentId: string;
  accountId: string;
  channelId: string;
};

/** Reused helper for normalize Route Binding Id behavior in src/routing. */
export function normalizeRouteBindingId(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "bigint") {
    return String(value).trim();
  }
  return "";
}

/** Reused helper for normalize Route Binding Roles behavior in src/routing. */
export function normalizeRouteBindingRoles(value: string[] | null | undefined): string[] | null {
  return Array.isArray(value) && value.length > 0 ? value : null;
}

/** Reused helper for normalize Route Binding Channel Id behavior in src/routing. */
export function normalizeRouteBindingChannelId(raw?: string | null): string | null {
  const normalized = normalizeChatChannelId(raw);
  if (normalized) {
    return normalized;
  }
  const fallback = normalizeLowercaseStringOrEmpty(raw);
  return fallback || null;
}

/** Reused helper for resolve Normalized Route Binding Match behavior in src/routing. */
export function resolveNormalizedRouteBindingMatch(
  binding: AgentRouteBinding,
): NormalizedRouteBindingMatch | null {
  if (!binding || typeof binding !== "object") {
    return null;
  }
  const match = binding.match;
  if (!match || typeof match !== "object") {
    return null;
  }
  const channelId = normalizeRouteBindingChannelId(match.channel);
  if (!channelId) {
    return null;
  }
  const accountId = typeof match.accountId === "string" ? match.accountId.trim() : "";
  if (!accountId || accountId === "*") {
    return null;
  }
  return {
    agentId: normalizeAgentId(binding.agentId),
    accountId: normalizeAccountId(accountId),
    channelId,
  };
}

function scopeIdMatches(params: {
  constraint: string | null | undefined;
  exact: string;
  groupSpace: string;
}): boolean {
  if (!params.constraint) {
    return true;
  }
  return params.constraint === params.exact || params.constraint === params.groupSpace;
}

function hasRoleLookup(
  memberRoleIds: Iterable<string>,
): memberRoleIds is Iterable<string> & { has(roleId: string): boolean } {
  return typeof (memberRoleIds as { has?: unknown }).has === "function";
}

function hasAnyRouteBindingRole(
  roles: readonly string[],
  memberRoleIds: Iterable<string> | null | undefined,
): boolean {
  if (!memberRoleIds) {
    return false;
  }
  if (hasRoleLookup(memberRoleIds)) {
    return roles.some((role) => memberRoleIds.has(role));
  }
  const memberRoleIdSet = new Set(memberRoleIds);
  return roles.some((role) => memberRoleIdSet.has(role));
}

/** Reused helper for route Binding Scope Matches behavior in src/routing. */
export function routeBindingScopeMatches(
  constraint: RouteBindingScopeConstraint,
  scope: RouteBindingScope,
): boolean {
  const guildId = normalizeRouteBindingId(scope.guildId);
  const teamId = normalizeRouteBindingId(scope.teamId);
  const groupSpace = normalizeRouteBindingId(scope.groupSpace);
  if (!scopeIdMatches({ constraint: constraint.guildId, exact: guildId, groupSpace })) {
    return false;
  }
  if (!scopeIdMatches({ constraint: constraint.teamId, exact: teamId, groupSpace })) {
    return false;
  }

  const roles = normalizeRouteBindingRoles(constraint.roles);
  if (!roles) {
    return true;
  }
  return hasAnyRouteBindingRole(roles, scope.memberRoleIds);
}
