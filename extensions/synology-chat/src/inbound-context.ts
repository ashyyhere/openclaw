// extensions/synology-chat/src inbound context helpers and runtime behavior.
export type SynologyInboundMessage = {
  body: string;
  from: string;
  senderName: string;
  provider: string;
  chatType: string;
  accountId: string;
  commandAuthorized: boolean;
  chatUserId?: string;
};
