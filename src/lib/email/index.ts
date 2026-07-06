import { renderEmail, type EmailTemplate } from "./templates";

/**
 * Email adapter. One entry point, `sendEmail()`, with swappable drivers.
 *
 * Default driver is "console": emails print to the server log so the whole app
 * works on an empty .env. To go live, set in .env.local:
 *   EMAIL_PROVIDER = mailersend | brevo | resend | smtp
 *   EMAIL_API_KEY  = <provider key>     (not needed for smtp)
 *   EMAIL_FROM     = "Beaumont <hello@yourdomain.com>"
 * No code change required.
 */

export interface SendArgs {
  to: string;
  template: EmailTemplate;
}

type Provider = "console" | "mailersend" | "brevo" | "resend" | "smtp";

const provider = (process.env.EMAIL_PROVIDER ?? "console") as Provider;
const apiKey = process.env.EMAIL_API_KEY ?? "";
const from = process.env.EMAIL_FROM ?? "Beaumont <concierge@beaumont.example>";

export async function sendEmail({ to, template }: SendArgs): Promise<{
  ok: boolean;
  provider: Provider;
  detail?: string;
}> {
  const { subject, html, text } = renderEmail(template);

  try {
    switch (provider) {
      case "mailersend":
        return await sendMailerSend({ to, subject, html, text });
      case "brevo":
        return await sendBrevo({ to, subject, html, text });
      case "resend":
        return await sendResend({ to, subject, html, text });
      case "smtp":
        return await sendSmtp({ to, subject, html, text });
      case "console":
      default:
        return sendConsole({ to, subject, text });
    }
  } catch (err) {
    console.error(`[email:${provider}] send failed:`, err);
    return { ok: false, provider, detail: String(err) };
  }
}

interface DriverArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
}

function sendConsole({
  to,
  subject,
  text,
}: Omit<DriverArgs, "html">): { ok: true; provider: Provider } {
  console.info(
    [
      "",
      "──────────── ✉  EMAIL (console driver) ────────────",
      `To:      ${to}`,
      `From:    ${from}`,
      `Subject: ${subject}`,
      "----------------------------------------------------",
      text,
      "──────────── set EMAIL_PROVIDER to send for real ───",
      "",
    ].join("\n"),
  );
  return { ok: true, provider: "console" };
}

async function sendMailerSend({ to, subject, html, text }: DriverArgs) {
  const res = await fetch("https://api.mailersend.com/v1/email", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: parseFrom(from),
      to: [{ email: to }],
      subject,
      html,
      text,
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return { ok: true as const, provider: "mailersend" as Provider };
}

async function sendBrevo({ to, subject, html, text }: DriverArgs) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: parseFrom(from),
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return { ok: true as const, provider: "brevo" as Provider };
}

async function sendResend({ to, subject, html, text }: DriverArgs) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return { ok: true as const, provider: "resend" as Provider };
}

import * as nodemailer from "nodemailer";

/**
 * SMTP driver. Uses nodemailer if installed (npm i nodemailer); otherwise it
 * falls back to console so the build never breaks for a missing optional dep.
 * Expects SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.
 */
async function sendSmtp({ to, subject, html, text }: DriverArgs) {
  if (!nodemailer) {
    console.warn(
      "[email:smtp] nodemailer not installed, run `npm i nodemailer`. Falling back to console.",
    );
    return sendConsole({ to, subject, text });
  }
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transport.sendMail({ from, to, subject, html, text });
  return { ok: true as const, provider: "smtp" as Provider };
}

/** "Name <email>" → { name, email } for providers that want structured sender. */
function parseFrom(value: string): { name: string; email: string } {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (match) return { name: match[1] || "Beaumont", email: match[2] };
  return { name: "Beaumont", email: value.trim() };
}
