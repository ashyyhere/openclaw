// Voice Call WebSocket test support creates upgrade servers and waits on socket events.
import { once } from "node:events";
import http from "node:http";
import { WebSocket } from "ws";

/** Races a promise against a timeout used by WebSocket tests. */
export const withTimeout = async <T>(promise: Promise<T>, timeoutMs = 2000): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timed out after ${timeoutMs}ms`)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};

/** Starts a local HTTP server that delegates WebSocket upgrade handling to the test. */
export const startUpgradeWsServer = async (params: {
  urlPath: string;
  onUpgrade: (
    request: http.IncomingMessage,
    socket: Parameters<http.Server["emit"]>[2],
    head: Buffer,
  ) => void;
}): Promise<{
  url: string;
  close: () => Promise<void>;
}> => {
  const server = http.createServer();
  server.on("upgrade", (request, socket, head) => {
    params.onUpgrade(request, socket, head);
  });

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to resolve test server address");
  }

  return {
    url: `ws://127.0.0.1:${address.port}${params.urlPath}`,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    },
  };
};

/** Connects a WebSocket and waits for the open event. */
export const connectWs = async (url: string): Promise<WebSocket> => {
  const ws = new WebSocket(url);
  await withTimeout(once(ws, "open") as Promise<[unknown]>);
  return ws;
};

/** Waits for a WebSocket close event and normalizes its code and reason. */
export const waitForClose = async (
  ws: WebSocket,
): Promise<{
  code: number;
  reason: string;
}> => {
  const [code, reason] = (await withTimeout(once(ws, "close") as Promise<[number, Buffer]>)) ?? [];
  return {
    code,
    reason: Buffer.isBuffer(reason) ? reason.toString("utf8") : String(reason || ""),
  };
};
