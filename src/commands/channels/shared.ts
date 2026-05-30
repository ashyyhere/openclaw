/** Shared channel command config, status, and formatting helpers. */
import { hasConfiguredUnavailableCredentialStatus } from "../../channels/account-snapshot-fields.js";
import type { ChannelId } from "../../channels/plugins/types.public.js";
import { resolveCommandConfigWithSecrets } from "../../cli/command-config-resolution.js";
import type { CommandSecretResolutionMode } from "../../cli/command-secret-gateway.js";
import { getChannelsCommandSecretTargetIds } from "../../cli/command-secret-targets.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { DEFAULT_ACCOUNT_ID } from "../../routing/session-key.js";
import { defaultRuntime, type RuntimeEnv } from "../../runtime.js";
import {
  requireValidConfigFileSnapshot,
  requireValidConfigSnapshot,
} from "../config-validation.js";

/** Channel id accepted by channel command helpers. */
export type ChatChannel = ChannelId;

/** Config snapshot validator shared by channel subcommands. */
export { requireValidConfigSnapshot };
/** Config file validator shared by channel subcommands. */
export { requireValidConfigFileSnapshot };

/** Loads validated config and resolves channel command secrets for status/setup paths. */
export async function requireValidConfig(
  runtime: RuntimeEnv = defaultRuntime,
  secretResolution?: {
    commandName?: string;
    mode?: CommandSecretResolutionMode;
  },
): Promise<OpenClawConfig | null> {
  const cfg = await requireValidConfigSnapshot(runtime);
  if (!cfg) {
    return null;
  }
  const { effectiveConfig } = await resolveCommandConfigWithSecrets({
    config: cfg,
    commandName: secretResolution?.commandName ?? "channels",
    targetIds: getChannelsCommandSecretTargetIds(),
    mode: secretResolution?.mode,
    runtime,
  });
  return effectiveConfig;
}

function formatAccountLabel(params: { accountId: string; name?: string }) {
  const base = params.accountId || DEFAULT_ACCOUNT_ID;
  if (params.name?.trim()) {
    return `${base} (${params.name.trim()})`;
  }
  return base;
}

/** Formats a channel/account display label with optional styling hooks. */
export function formatChannelAccountLabel(params: {
  channel: ChatChannel;
  accountId: string;
  name?: string;
  channelLabel?: string;
  channelStyle?: (value: string) => string;
  accountStyle?: (value: string) => string;
}): string {
  const channelText = params.channelLabel ?? params.channel;
  const accountText = formatAccountLabel({
    accountId: params.accountId,
    name: params.name,
  });
  const styledChannel = params.channelStyle ? params.channelStyle(channelText) : channelText;
  const styledAccount = params.accountStyle ? params.accountStyle(accountText) : accountText;
  return `${styledChannel} ${styledAccount}`;
}

/** Appends enabled/configured/linked status bits for an account status line. */
export function appendEnabledConfiguredLinkedBits(
  bits: string[],
  account: Record<string, unknown>,
) {
  if (typeof account.enabled === "boolean") {
    bits.push(account.enabled ? "enabled" : "disabled");
  }
  if (typeof account.configured === "boolean") {
    if (account.configured) {
      bits.push("configured");
      if (hasConfiguredUnavailableCredentialStatus(account)) {
        bits.push("secret unavailable in this command path");
      }
    } else {
      bits.push("not configured");
    }
  }
  if (typeof account.linked === "boolean") {
    bits.push(account.linked ? "linked" : "not linked");
  }
}

/** Appends the channel mode status bit when present. */
export function appendModeBit(bits: string[], account: Record<string, unknown>) {
  if (typeof account.mode === "string" && account.mode.length > 0) {
    bits.push(`mode:${account.mode}`);
  }
}

/** Appends token/source status bits, including unavailable SecretRef markers. */
export function appendTokenSourceBits(bits: string[], account: Record<string, unknown>) {
  const appendSourceBit = (label: string, sourceKey: string, statusKey: string) => {
    const source = account[sourceKey];
    if (typeof source !== "string" || !source || source === "none") {
      return;
    }
    const status = account[statusKey];
    const unavailable = status === "configured_unavailable" ? " (unavailable)" : "";
    bits.push(`${label}:${source}${unavailable}`);
  };

  appendSourceBit("token", "tokenSource", "tokenStatus");
  appendSourceBit("bot", "botTokenSource", "botTokenStatus");
  appendSourceBit("app", "appTokenSource", "appTokenStatus");
  appendSourceBit("signing", "signingSecretSource", "signingSecretStatus");
}

/** Appends the configured base URL status bit when the account exposes one. */
export function appendBaseUrlBit(bits: string[], account: Record<string, unknown>) {
  if (typeof account.baseUrl === "string" && account.baseUrl) {
    bits.push(`url:${account.baseUrl}`);
  }
}

/** Builds one bullet line for channel account status output. */
export function buildChannelAccountLine(
  provider: ChatChannel,
  account: Record<string, unknown>,
  bits: string[],
  opts?: { channelLabel?: string },
): string {
  const accountId = typeof account.accountId === "string" ? account.accountId : DEFAULT_ACCOUNT_ID;
  const name = typeof account.name === "string" ? account.name : undefined;
  const labelText = formatChannelAccountLabel({
    channel: provider,
    accountId,
    name,
    channelLabel: opts?.channelLabel,
  });
  return `- ${labelText}: ${bits.join(", ")}`;
}

/** Chooses the wizard path when no explicit channel command flags were provided. */
export function shouldUseWizard(params?: { hasFlags?: boolean }) {
  return params?.hasFlags === false;
}
