import { sanitizeForLog } from "../../../packages/terminal-core/src/ansi.js";

/** Reused helper for sanitize Doctor Note behavior in src/commands/doctor. */
export function sanitizeDoctorNote(note: string): string {
  return note
    .split("\n")
    .map((line) => sanitizeForLog(line))
    .join("\n");
}

/** Reused helper for emit Doctor Notes behavior in src/commands/doctor. */
export function emitDoctorNotes(params: {
  note: (message: string, title?: string) => void;
  changeNotes?: string[];
  infoNotes?: string[];
  warningNotes?: string[];
}): void {
  for (const change of params.changeNotes ?? []) {
    params.note(sanitizeDoctorNote(change), "Doctor changes");
  }
  for (const info of params.infoNotes ?? []) {
    params.note(sanitizeDoctorNote(info), "Doctor info");
  }
  for (const warning of params.warningNotes ?? []) {
    params.note(sanitizeDoctorNote(warning), "Doctor warnings");
  }
}
