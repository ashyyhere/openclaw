// infra/outbound message action test fixtures helpers and runtime behavior.
/** Reused helper for create Pinboard Message Action Bootstrap Registry Mock behavior in src/infra/outbound. */
export function createPinboardMessageActionBootstrapRegistryMock() {
  return (channel: string) => {
    if (channel === "pinboard") {
      return {
        actions: {
          messageActionTargetAliases: {
            read: { aliases: ["messageId"] },
            pin: { aliases: ["messageId"] },
            unpin: { aliases: ["messageId"] },
            "list-pins": { aliases: ["chatId"] },
            "channel-info": { aliases: ["chatId"] },
          },
        },
      };
    }
    if (channel === "imessage") {
      return {
        actions: {
          messageActionTargetAliases: {
            "upload-file": { aliases: ["chatGuid", "chatIdentifier", "chatId"] },
          },
        },
      };
    }
    return undefined;
  };
}
