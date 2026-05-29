// Tests extensions/cloudflare-ai-gateway provider discovery contract test behavior.
import { describeCloudflareAiGatewayProviderDiscoveryContract } from "openclaw/plugin-sdk/provider-test-contracts";

describeCloudflareAiGatewayProviderDiscoveryContract(() => import("./index.js"));
