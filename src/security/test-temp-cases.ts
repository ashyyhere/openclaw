// security test temp cases helpers and runtime behavior.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/** Reused class for Async Temp Case Factory behavior in src/security. */
export class AsyncTempCaseFactory {
  private caseId = 0;
  private fixtureRoot = "";

  constructor(private readonly prefix: string) {}

  async setup() {
    this.fixtureRoot = await fs.mkdtemp(path.join(os.tmpdir(), this.prefix));
  }

  async cleanup() {
    if (!this.fixtureRoot) {
      return;
    }
    await fs.rm(this.fixtureRoot, { recursive: true, force: true }).catch(() => undefined);
  }

  async makeTmpDir(label: string) {
    const dir = path.join(this.fixtureRoot, `case-${this.caseId++}-${label}`);
    await fs.mkdir(dir, { recursive: true });
    return dir;
  }
}
