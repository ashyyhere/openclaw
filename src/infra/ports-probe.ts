// infra ports probe helpers and runtime behavior.
import net from "node:net";

/** Reused helper for try Listen On Port behavior in src/infra. */
export async function tryListenOnPort(params: {
  port: number;
  host?: string;
  exclusive?: boolean;
}): Promise<void> {
  const listenOptions: net.ListenOptions = { port: params.port };
  if (params.host) {
    listenOptions.host = params.host;
  }
  if (typeof params.exclusive === "boolean") {
    listenOptions.exclusive = params.exclusive;
  }
  await new Promise<void>((resolve, reject) => {
    const tester = net
      .createServer()
      .once("error", (err) => reject(err))
      .once("listening", () => {
        tester.close(() => resolve());
      })
      .listen(listenOptions);
  });
}
