/** Finalizes doctor config flow after repairs and persistence. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";

/** Reused helper for finalize Doctor Config Flow behavior in src/commands/doctor. */
export async function finalizeDoctorConfigFlow(params: {
  cfg: OpenClawConfig;
  candidate: OpenClawConfig;
  pendingChanges: boolean;
  shouldRepair: boolean;
  fixHints: string[];
  confirm: (p: { message: string; initialValue: boolean }) => Promise<boolean>;
  note: (message: string, title?: string) => void;
}): Promise<{ cfg: OpenClawConfig; shouldWriteConfig: boolean }> {
  if (!params.shouldRepair && params.pendingChanges) {
    const shouldApply = await params.confirm({
      message: "Apply recommended config repairs now?",
      initialValue: true,
    });
    if (shouldApply) {
      return {
        cfg: params.candidate,
        shouldWriteConfig: true,
      };
    }
    if (params.fixHints.length > 0) {
      params.note(params.fixHints.join("\n"), "Doctor");
    }
    return {
      cfg: params.cfg,
      shouldWriteConfig: false,
    };
  }

  if (params.shouldRepair && params.pendingChanges) {
    return {
      cfg: params.cfg,
      shouldWriteConfig: true,
    };
  }

  return {
    cfg: params.cfg,
    shouldWriteConfig: false,
  };
}
