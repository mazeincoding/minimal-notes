import { createAuthClient } from "better-auth/react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_APP_URL is not set");
}

export const authClient = createAuthClient({
  baseURL: baseUrl,
});

export const { useSession } = authClient;

export async function disconnectMexc() {
  const response = await fetch(`${baseUrl}/api/mexc/disconnect`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to disconnect from MEXC");
  }

  return response.json();
}
