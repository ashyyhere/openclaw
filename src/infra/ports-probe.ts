/** Probes whether a local TCP port can be bound. */
import net from "node:net";

/** Attempt a temporary listen on a port and reject with the native bind error. */
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
