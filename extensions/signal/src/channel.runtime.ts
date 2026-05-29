// Runtime boundary for extensions/signal/src channel runtime behavior.
import { signalSetupWizard as signalSetupWizardImpl } from "./setup-surface.js";

type SignalSetupWizard = typeof import("./setup-surface.js").signalSetupWizard;

export const signalSetupWizard: SignalSetupWizard = { ...signalSetupWizardImpl };
