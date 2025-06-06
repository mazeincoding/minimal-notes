import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_APP_URL is not set");
}

export const authClient = createAuthClient({
  baseURL: baseUrl,
  plugins: [magicLinkClient()],
});

export const { useSession } = authClient;

