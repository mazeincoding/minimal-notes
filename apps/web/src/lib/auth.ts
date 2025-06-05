import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  appName: "Mexc+",
  rateLimit: {
    enabled: true,
    window: 10,
    max: 100,
    customRules: {
      "/api/*": {
        window: 10,
        max: 100,
      },
      "/api/mexc/disconnect": {
        window: 60,
        max: 10,
      },
      "/api/mexc/store-keys": {
        window: 60,
        max: 5,
      },
      "/api/mexc/price": {
        window: 10,
        max: 30,
      },
      "/api/mexc/coins": {
        window: 60,
        max: 5,
      },
      "/api/mexc/account/trades": {
        window: 10,
        max: 20,
      },
      "/api/mexc/account/trades/execute": {
        window: 60,
        max: 10,
      },
      "/api/mexc/account/assets": {
        window: 10,
        max: 30,
      },

      // Currency conversion
      "/api/currency/convert": {
        window: 10,
        max: 50,
      },

      // Search and metadata - moderate limits
      "/api/search": {
        window: 10,
        max: 50,
      },
      "/api/coin/metadata": {
        window: 10,
        max: 50,
      },

      // Individual coin routes - higher limits for frequent access
      "/api/coin/*": {
        window: 10,
        max: 100,
      },
    },
    storage: "database",
    modelName: "rateLimit",
  },
  trustedOrigins: [
    "http://localhost:4000",
    "http://localhost:4001",
    "https://mexc-wrapper-177.vercel.app",
  ],
});

export type Auth = typeof auth;
