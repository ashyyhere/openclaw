/** Creates owner-only temporary files for spilled tool output. */
import { randomBytes } from "node:crypto";
import { createWriteStream, type WriteStream } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Creates a private temp write stream and cleanup callback. */
export function createPrivateTempWriteStream(prefix: string): {
  path: string;
  stream: WriteStream;
} {
  const id = randomBytes(8).toString("hex");
  const filePath = join(tmpdir(), `${prefix}-${id}.log`);
  return {
    path: filePath,
    stream: createWriteStream(filePath, { flags: "wx", mode: 0o600 }),
  };
}
