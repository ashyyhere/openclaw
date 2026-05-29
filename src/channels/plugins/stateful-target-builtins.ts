/** Registers built-in stateful binding target drivers once per process. */
import { registerStatefulBindingTargetDriver } from "./stateful-target-drivers.js";

type AcpStatefulTargetDriverModule = typeof import("./acp-stateful-target-driver.js");

let builtinsRegisteredPromise: Promise<void> | null = null;
let acpDriverModulePromise: Promise<AcpStatefulTargetDriverModule> | undefined;

function loadAcpStatefulTargetDriverModule(): Promise<AcpStatefulTargetDriverModule> {
  acpDriverModulePromise ??= import("./acp-stateful-target-driver.js");
  return acpDriverModulePromise;
}

/** Reused helper for is Stateful Target Builtin Driver Id behavior in src/channels/plugins. */
export function isStatefulTargetBuiltinDriverId(id: string): boolean {
  return id.trim() === "acp";
}

/** Reused helper for ensure Stateful Target Builtins Registered behavior in src/channels/plugins. */
export async function ensureStatefulTargetBuiltinsRegistered(): Promise<void> {
  if (builtinsRegisteredPromise) {
    await builtinsRegisteredPromise;
    return;
  }
  builtinsRegisteredPromise = (async () => {
    const { acpStatefulBindingTargetDriver } = await loadAcpStatefulTargetDriverModule();
    registerStatefulBindingTargetDriver(acpStatefulBindingTargetDriver);
  })();
  try {
    await builtinsRegisteredPromise;
  } catch (error) {
    builtinsRegisteredPromise = null;
    throw error;
  }
}
