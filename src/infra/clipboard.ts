/** Cross-platform clipboard write helper used by CLI conveniences. */
import { runCommandWithTimeout } from "../process/exec.js";

/** Try common platform clipboard commands and report whether any accepted the text. */
export async function copyToClipboard(value: string): Promise<boolean> {
  const attempts: Array<{ argv: string[] }> = [
    { argv: ["pbcopy"] },
    { argv: ["xclip", "-selection", "clipboard"] },
    { argv: ["wl-copy"] },
    { argv: ["clip.exe"] }, // WSL / Windows
    { argv: ["powershell", "-NoProfile", "-Command", "Set-Clipboard"] },
  ];
  for (const attempt of attempts) {
    try {
      const result = await runCommandWithTimeout(attempt.argv, {
        timeoutMs: 3_000,
        input: value,
      });
      if (result.code === 0 && !result.killed) {
        return true;
      }
    } catch {
      // keep trying the next fallback
    }
  }
  return false;
}
