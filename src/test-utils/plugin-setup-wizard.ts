// test-utils plugin setup wizard helpers and runtime behavior.
import { vi, type Mock } from "vitest";
import { buildChannelSetupWizardAdapterFromSetupWizard } from "../channels/plugins/setup-wizard.js";
import type { ChannelPlugin } from "../channels/plugins/types.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import { createRuntimeEnv } from "./plugin-runtime-env.js";

/** Re-exported API for src/test-utils, starting with Wizard Prompter. */
export type { WizardPrompter } from "../wizard/prompts.js";
type UnknownMock = Mock<(...args: unknown[]) => unknown>;
type AsyncUnknownMock = Mock<(...args: unknown[]) => Promise<unknown>>;
type QueuedWizardPrompter = {
  intro: AsyncUnknownMock;
  outro: AsyncUnknownMock;
  note: AsyncUnknownMock;
  plain: AsyncUnknownMock;
  select: AsyncUnknownMock;
  multiselect: AsyncUnknownMock;
  text: AsyncUnknownMock;
  confirm: AsyncUnknownMock;
  progress: Mock<() => { update: UnknownMock; stop: UnknownMock }>;
  prompter: WizardPrompter;
};

/** Reused helper for select First Wizard Option behavior in src/test-utils. */
export async function selectFirstWizardOption<T>(params: {
  options: Array<{ value: T }>;
}): Promise<T> {
  const first = params.options[0];
  if (!first) {
    throw new Error("no options");
  }
  return first.value;
}

/** Reused helper for create Test Wizard Prompter behavior in src/test-utils. */
export function createTestWizardPrompter(overrides: Partial<WizardPrompter> = {}): WizardPrompter {
  return {
    intro: vi.fn(async () => {}),
    outro: vi.fn(async () => {}),
    note: vi.fn(async () => {}),
    plain: vi.fn(async () => {}),
    select: selectFirstWizardOption as WizardPrompter["select"],
    multiselect: vi.fn(async () => []),
    text: vi.fn(async () => "") as WizardPrompter["text"],
    confirm: vi.fn(async () => false),
    progress: vi.fn(() => ({ update: vi.fn(), stop: vi.fn() })),
    ...overrides,
  };
}

/** Reused helper for create Queued Wizard Prompter behavior in src/test-utils. */
export function createQueuedWizardPrompter(params?: {
  selectValues?: string[];
  textValues?: string[];
  confirmValues?: boolean[];
}): QueuedWizardPrompter {
  const selectValues = [...(params?.selectValues ?? [])];
  const textValues = [...(params?.textValues ?? [])];
  const confirmValues = [...(params?.confirmValues ?? [])];

  const intro = vi.fn(async () => undefined);
  const outro = vi.fn(async () => undefined);
  const note = vi.fn(async () => undefined);
  const plain = vi.fn(async () => undefined);
  const select = vi.fn(async () => selectValues.shift() ?? "");
  const multiselect = vi.fn(async () => [] as string[]);
  const text = vi.fn(async () => textValues.shift() ?? "");
  const confirm = vi.fn(async () => confirmValues.shift() ?? false);
  const progress = vi.fn(() => ({
    update: vi.fn(),
    stop: vi.fn(),
  }));

  return {
    intro,
    outro,
    note,
    plain,
    select,
    multiselect,
    text,
    confirm,
    progress,
    prompter: createTestWizardPrompter({
      intro,
      outro,
      note,
      plain,
      select: select as WizardPrompter["select"],
      multiselect: multiselect as WizardPrompter["multiselect"],
      text: text as WizardPrompter["text"],
      confirm,
      progress,
    }),
  };
}

type SetupWizardAdapterParams = Parameters<typeof buildChannelSetupWizardAdapterFromSetupWizard>[0];
type SetupWizardPlugin = SetupWizardAdapterParams["plugin"];
type SetupWizard = NonNullable<SetupWizardAdapterParams["wizard"]>;
type SetupWizardCredentialValues = Record<string, string>;
type SetupWizardTestPlugin = {
  id: string;
  setupWizard?: ChannelPlugin["setupWizard"];
  config: Record<string, unknown>;
} & Record<string, unknown>;

function isDeclarativeSetupWizard(
  setupWizard: ChannelPlugin["setupWizard"],
): setupWizard is SetupWizard {
  return Boolean(
    setupWizard &&
    typeof setupWizard === "object" &&
    "status" in setupWizard &&
    "credentials" in setupWizard,
  );
}

function requireDeclarativeSetupWizard(plugin: SetupWizardTestPlugin): SetupWizard {
  const { setupWizard } = plugin;
  if (!setupWizard) {
    throw new Error(`${plugin.id} is missing setupWizard`);
  }
  if (!isDeclarativeSetupWizard(setupWizard)) {
    throw new Error(`${plugin.id} setupWizard is adapter-shaped; test helper expects a wizard`);
  }
  return setupWizard;
}

function resolveSetupWizardAccountContext<TCfg>(params: {
  cfg?: TCfg;
  accountId?: string;
  credentialValues?: SetupWizardCredentialValues;
}) {
  return {
    cfg: (params.cfg ?? {}) as TCfg,
    accountId: params.accountId ?? "default",
    credentialValues: params.credentialValues ?? {},
  };
}

function resolveSetupWizardRuntime<TRuntime>(runtime?: TRuntime): TRuntime {
  return (runtime ?? createRuntimeEnv({ throwOnExit: false })) as TRuntime;
}

function resolveSetupWizardPrompter(prompter?: WizardPrompter): WizardPrompter {
  return prompter ?? createTestWizardPrompter();
}

function resolveSetupWizardNotePrompter(prompter?: Pick<WizardPrompter, "note">) {
  return (
    prompter ??
    ({
      note: vi.fn(async () => undefined),
    } satisfies Pick<WizardPrompter, "note">)
  );
}

/** Reused helper for create Setup Wizard Adapter behavior in src/test-utils. */
export function createSetupWizardAdapter(params: SetupWizardAdapterParams) {
  return buildChannelSetupWizardAdapterFromSetupWizard(params);
}

/** Reused helper for create Plugin Setup Wizard Adapter behavior in src/test-utils. */
export function createPluginSetupWizardAdapter(plugin: SetupWizardTestPlugin) {
  const wizard = requireDeclarativeSetupWizard(plugin);
  return createSetupWizardAdapter({
    plugin: plugin as unknown as SetupWizardPlugin,
    wizard,
  });
}

/** Reused helper for create Plugin Setup Wizard Configure behavior in src/test-utils. */
export function createPluginSetupWizardConfigure(plugin: SetupWizardTestPlugin) {
  return createPluginSetupWizardAdapter(plugin).configure;
}

/** Reused helper for create Plugin Setup Wizard Status behavior in src/test-utils. */
export function createPluginSetupWizardStatus(plugin: SetupWizardTestPlugin) {
  return createPluginSetupWizardAdapter(plugin).getStatus;
}

/** Reused helper for run Setup Wizard Configure behavior in src/test-utils. */
export async function runSetupWizardConfigure<
  TCfg,
  TOptions extends Record<string, unknown>,
  TAccountOverrides extends Record<string, string | undefined>,
  TRuntime,
  TResult,
>(params: {
  configure: (args: {
    cfg: TCfg;
    runtime: TRuntime;
    prompter: WizardPrompter;
    options: TOptions;
    accountOverrides: TAccountOverrides;
    shouldPromptAccountIds: boolean;
    forceAllowFrom: boolean;
  }) => Promise<TResult>;
  cfg?: TCfg;
  runtime?: TRuntime;
  prompter: WizardPrompter;
  options?: TOptions;
  accountOverrides?: TAccountOverrides;
  shouldPromptAccountIds?: boolean;
  forceAllowFrom?: boolean;
}): Promise<TResult> {
  return await params.configure({
    cfg: (params.cfg ?? {}) as TCfg,
    runtime: (params.runtime ?? createRuntimeEnv()) as TRuntime,
    prompter: params.prompter,
    options: (params.options ?? {}) as TOptions,
    accountOverrides: (params.accountOverrides ?? {}) as TAccountOverrides,
    shouldPromptAccountIds: params.shouldPromptAccountIds ?? false,
    forceAllowFrom: params.forceAllowFrom ?? false,
  });
}

/** Reused helper for run Setup Wizard Prepare behavior in src/test-utils. */
export async function runSetupWizardPrepare<
  TCfg,
  TOptions extends Record<string, unknown>,
  TRuntime,
  TResult,
>(params: {
  prepare?: (args: {
    cfg: TCfg;
    accountId: string;
    credentialValues: Record<string, string>;
    runtime: TRuntime;
    prompter: WizardPrompter;
    options?: TOptions;
  }) => Promise<TResult> | TResult;
  cfg?: TCfg;
  accountId?: string;
  credentialValues?: Record<string, string>;
  runtime?: TRuntime;
  prompter?: WizardPrompter;
  options?: TOptions;
}): Promise<TResult | undefined> {
  const context = resolveSetupWizardAccountContext({
    cfg: params.cfg,
    accountId: params.accountId,
    credentialValues: params.credentialValues,
  });
  return await params.prepare?.({
    ...context,
    runtime: resolveSetupWizardRuntime(params.runtime),
    prompter: resolveSetupWizardPrompter(params.prompter),
    options: params.options,
  });
}

/** Reused helper for run Setup Wizard Finalize behavior in src/test-utils. */
export async function runSetupWizardFinalize<
  TCfg,
  TOptions extends Record<string, unknown>,
  TRuntime,
  TResult,
>(params: {
  finalize?: (args: {
    cfg: TCfg;
    accountId: string;
    credentialValues: Record<string, string>;
    runtime: TRuntime;
    prompter: WizardPrompter;
    options?: TOptions;
    forceAllowFrom: boolean;
  }) => Promise<TResult> | TResult;
  cfg?: TCfg;
  accountId?: string;
  credentialValues?: Record<string, string>;
  runtime?: TRuntime;
  prompter?: WizardPrompter;
  options?: TOptions;
  forceAllowFrom?: boolean;
}): Promise<TResult | undefined> {
  const context = resolveSetupWizardAccountContext({
    cfg: params.cfg,
    accountId: params.accountId,
    credentialValues: params.credentialValues,
  });
  return await params.finalize?.({
    ...context,
    runtime: resolveSetupWizardRuntime(params.runtime),
    prompter: resolveSetupWizardPrompter(params.prompter),
    options: params.options,
    forceAllowFrom: params.forceAllowFrom ?? false,
  });
}

/** Reused helper for prompt Setup Wizard Allow From behavior in src/test-utils. */
export async function promptSetupWizardAllowFrom<TCfg, TResult>(params: {
  promptAllowFrom?: (args: {
    cfg: TCfg;
    prompter: WizardPrompter;
    accountId: string;
  }) => Promise<TResult> | TResult;
  cfg?: TCfg;
  prompter?: WizardPrompter;
  accountId?: string;
}): Promise<TResult | undefined> {
  const context = resolveSetupWizardAccountContext({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  return await params.promptAllowFrom?.({
    cfg: context.cfg,
    accountId: context.accountId,
    prompter: resolveSetupWizardPrompter(params.prompter),
  });
}

/** Reused helper for resolve Setup Wizard Allow From Entries behavior in src/test-utils. */
export async function resolveSetupWizardAllowFromEntries<TCfg, TResult>(params: {
  resolveEntries?: (args: {
    cfg: TCfg;
    accountId: string;
    credentialValues: Record<string, string>;
    entries: string[];
  }) => Promise<TResult> | TResult;
  entries: string[];
  cfg?: TCfg;
  accountId?: string;
  credentialValues?: SetupWizardCredentialValues;
}): Promise<TResult | undefined> {
  const context = resolveSetupWizardAccountContext({
    cfg: params.cfg,
    accountId: params.accountId,
    credentialValues: params.credentialValues,
  });
  return await params.resolveEntries?.({
    ...context,
    entries: params.entries,
  });
}

/** Reused helper for resolve Setup Wizard Group Allowlist behavior in src/test-utils. */
export async function resolveSetupWizardGroupAllowlist<TCfg, TResult>(params: {
  resolveAllowlist?: (args: {
    cfg: TCfg;
    accountId: string;
    credentialValues: Record<string, string>;
    entries: string[];
    prompter: Pick<WizardPrompter, "note">;
  }) => Promise<TResult> | TResult;
  entries: string[];
  cfg?: TCfg;
  accountId?: string;
  credentialValues?: SetupWizardCredentialValues;
  prompter?: Pick<WizardPrompter, "note">;
}): Promise<TResult | undefined> {
  const context = resolveSetupWizardAccountContext({
    cfg: params.cfg,
    accountId: params.accountId,
    credentialValues: params.credentialValues,
  });
  return await params.resolveAllowlist?.({
    ...context,
    entries: params.entries,
    prompter: resolveSetupWizardNotePrompter(params.prompter),
  });
}
