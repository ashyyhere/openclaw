// test-utils secret file fixture helpers and runtime behavior.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

type SecretFiles = {
  passwordFile?: string;
  tokenFile?: string;
};

/** Reused helper for with Temp Secret Files behavior in src/test-utils. */
export async function withTempSecretFiles<T>(
  prefix: string,
  secrets: { password?: string; token?: string },
  run: (files: SecretFiles) => Promise<T>,
): Promise<T> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
  try {
    const files: SecretFiles = {};
    if (secrets.token !== undefined) {
      files.tokenFile = path.join(dir, "token.txt");
      await fs.writeFile(files.tokenFile, secrets.token, "utf8");
    }
    if (secrets.password !== undefined) {
      files.passwordFile = path.join(dir, "password.txt");
      await fs.writeFile(files.passwordFile, secrets.password, "utf8");
    }
    return await run(files);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}
