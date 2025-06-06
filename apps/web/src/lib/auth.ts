import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { magicLink } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        try {
          await resend.emails.send({
            from: "Minimal Notes <hi@mazewinther.com>",
            to: [email],
            subject: "Sign in to Minimal Notes",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Sign in to Minimal Notes</h2>
                <p>Click the button below to sign in to your account:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${url}" 
                     style="background-color: #007bff; color: white; padding: 12px 24px; 
                            text-decoration: none; border-radius: 6px; display: inline-block;">
                    Sign In
                  </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                  If you didn't request this email, you can safely ignore it.
                </p>
                <p style="color: #666; font-size: 14px;">
                  This link will expire in 24 hours.
                </p>
              </div>
            `,
            text: `Sign in to Minimal Notes\n\nClick the link below to sign in:\n${url}\n\nIf you didn't request this email, you can safely ignore it.\nThis link will expire in 24 hours.`,
          });

          console.log(`Magic link sent to ${email}`);
        } catch (error) {
          console.error("Failed to send magic link:", error);
          throw new Error("Failed to send magic link email");
        }
      },
    }),
  ],
  trustedOrigins: [
    "http://localhost:4000",
    "http://localhost:4001",
    "https://mexc-wrapper-177.vercel.app",
  ],
});

export type Auth = typeof auth;
