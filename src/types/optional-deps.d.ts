/**
 * Ambient stubs for OPTIONAL runtime dependencies that are lazy-imported only
 * when the matching provider is configured (Stripe for card payments, nodemailer
 * for the SMTP email driver). They are intentionally NOT in package.json so the
 * zero-key install stays lean. These minimal declarations let `tsc` pass without
 * them; when you actually install the real package, its own types take over.
 */

declare module "stripe" {
  export default class Stripe {
    constructor(key: string, config?: unknown);
    checkout: {
      sessions: {
        create(params: unknown): Promise<{ url: string | null }>;
      };
    };
    webhooks: {
      constructEvent(body: string, sig: string, secret: string): unknown;
    };
  }
}

declare module "nodemailer" {
  export interface Transporter {
    sendMail(options: unknown): Promise<unknown>;
  }
  export function createTransport(options: unknown): Transporter;
  const _default: { createTransport: typeof createTransport };
  export default _default;
}
