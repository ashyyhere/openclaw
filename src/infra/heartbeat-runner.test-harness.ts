// infra heartbeat runner test harness helpers and runtime behavior.
import { beforeEach } from "vitest";
import {
  heartbeatRunnerSlackPlugin,
  heartbeatRunnerTelegramPlugin,
  heartbeatRunnerWhatsAppPlugin,
} from "../../test/helpers/infra/heartbeat-runner-channel-plugins.js";
import { setActivePluginRegistry } from "../plugins/runtime.js";
import { createTestRegistry } from "../test-utils/channel-plugins.js";

/** Reused helper for install Heartbeat Runner Test Runtime behavior in src/infra. */
export function installHeartbeatRunnerTestRuntime(params?: { includeSlack?: boolean }): void {
  beforeEach(() => {
    if (params?.includeSlack) {
      setActivePluginRegistry(
        createTestRegistry([
          { pluginId: "slack", plugin: heartbeatRunnerSlackPlugin, source: "test" },
          { pluginId: "whatsapp", plugin: heartbeatRunnerWhatsAppPlugin, source: "test" },
          { pluginId: "telegram", plugin: heartbeatRunnerTelegramPlugin, source: "test" },
        ]),
      );
      return;
    }
    setActivePluginRegistry(
      createTestRegistry([
        { pluginId: "whatsapp", plugin: heartbeatRunnerWhatsAppPlugin, source: "test" },
        { pluginId: "telegram", plugin: heartbeatRunnerTelegramPlugin, source: "test" },
      ]),
    );
  });
}
