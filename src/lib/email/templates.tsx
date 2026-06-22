import { site } from "@/lib/config";
import { formatCurrency } from "@/lib/pricing";

/** Discriminated union of every transactional email Beaumont sends. */
export type EmailTemplate =
  | { kind: "welcome"; name: string }
  | { kind: "quote_requested"; name: string; total: number; address: string }
  | {
      kind: "quote_lead";
      name: string;
      email: string;
      accountEmail: string;
      phone: string;
      address: string;
      service: string;
      areaM2: number;
      frequency: string;
      conditionalServices: string[];
      estimate: number;
    }
  | { kind: "quote_sent"; name: string; total: number; quoteUrl: string }
  | { kind: "payment_receipt"; name: string; amount: number; method: string }
  | { kind: "referral_credited"; name: string; points: number }
  | { kind: "quote_cancelled"; name: string; address: string; total: number };

interface Rendered {
  subject: string;
  html: string;
  text: string;
}

const shell = (heading: string, bodyHtml: string) => `
<!doctype html>
<html>
  <body style="margin:0;background:#F9F8E7;font-family:Georgia,'Times New Roman',serif;color:#1D170F;">
    <div style="max-width:560px;margin:0 auto;padding:40px 32px;">
      <div style="text-align:center;margin-bottom:28px;letter-spacing:.18em;font-size:22px;font-weight:700;color:#40261A;">BEAUMONT</div>
      <div style="background:#ffffff;border:1px solid #E8E0CF;border-radius:16px;padding:32px;">
        <h1 style="font-size:22px;margin:0 0 16px;color:#40261A;">${heading}</h1>
        ${bodyHtml}
      </div>
      <p style="text-align:center;color:#A1794F;font-size:12px;margin-top:24px;font-family:Arial,sans-serif;">
        ${site.name} · ${site.promise}
      </p>
    </div>
  </body>
</html>`;

const p = (t: string) =>
  `<p style="font-size:15px;line-height:1.7;margin:0 0 14px;font-family:Arial,sans-serif;">${t}</p>`;

const button = (label: string, href: string) =>
  `<a href="${href}" style="display:inline-block;background:#7A4327;color:#F9F8E7;text-decoration:none;padding:12px 24px;border-radius:999px;font-family:Arial,sans-serif;font-size:14px;">${label}</a>`;

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[
        character
      ] ?? character,
  );

export function renderEmail(t: EmailTemplate): Rendered {
  switch (t.kind) {
    case "welcome":
      return {
        subject: `Welcome to ${site.name}`,
        text: `Welcome, ${t.name}. Your account is ready. Draw your space for an instant estimate any time.`,
        html: shell(
          `Welcome, ${t.name}`,
          p("Your account is ready.") +
            p(
              "Draw your space whenever you like for an instant estimate, track quotes, and watch your reward points grow.",
            ),
        ),
      };
    case "quote_requested":
      return {
        subject: `We received your quote request`,
        text: `Thank you, ${t.name}. We received your request for ${t.address} (estimate ${formatCurrency(
          t.total,
        )}). Our team will confirm a final quote shortly.`,
        html: shell(
          "Quote request received",
          p(`Thank you, ${t.name}.`) +
            p(
              `We've received your request for <strong>${t.address}</strong> with an instant estimate of <strong>${formatCurrency(
                t.total,
              )}</strong>.`,
            ) +
            p("Our team will review and confirm a final quote shortly."),
        ),
      };
    case "quote_lead": {
      const name = escapeHtml(t.name);
      const email = escapeHtml(t.email);
      const accountEmail = escapeHtml(t.accountEmail);
      const phone = escapeHtml(t.phone);
      const address = escapeHtml(t.address);
      const service = escapeHtml(t.service);
      const frequency = escapeHtml(t.frequency);
      const conditionalServices = t.conditionalServices.length
        ? t.conditionalServices.map(escapeHtml).join(", ")
        : "None selected";
      const text = [
        `New formal quote request from ${t.name}`,
        `Email: ${t.email}`,
        `Signed-in account: ${t.accountEmail}`,
        `Phone: ${t.phone}`,
        `Address: ${t.address}`,
        `Service: ${t.service}`,
        `Measured area: ${Math.round(t.areaM2)} m²`,
        `Visit rhythm: ${t.frequency}`,
        `Conditional services: ${t.conditionalServices.join(", ") || "None selected"}`,
        `Instant estimate: ${formatCurrency(t.estimate)}`,
      ].join("\n");

      return {
        subject: `New quote request — ${t.name}`,
        text,
        html: shell(
          "New formal quote request",
          p(`<strong>${name}</strong> has requested a quote.`) +
            p(`<strong>Contact email:</strong> ${email}<br><strong>Signed-in account:</strong> ${accountEmail}<br><strong>Phone:</strong> ${phone}`) +
            p(`<strong>Property:</strong> ${address}`) +
            p(`<strong>Service:</strong> ${service}<br><strong>Measured area:</strong> ${Math.round(t.areaM2)} m²<br><strong>Visit rhythm:</strong> ${frequency}`) +
            p(`<strong>Conditional services:</strong> ${conditionalServices}`) +
            p(`<strong>Instant estimate:</strong> ${formatCurrency(t.estimate)}`),
        ),
      };
    }
    case "quote_sent":
      return {
        subject: `Your Beaumont quote is ready`,
        text: `${t.name}, your quote of ${formatCurrency(
          t.total,
        )} is ready. View it: ${t.quoteUrl}`,
        html: shell(
          "Your quote is ready",
          p(`${t.name}, your tailored quote is ready.`) +
            p(`Total: <strong>${formatCurrency(t.total)}</strong>`) +
            `<div style="margin-top:8px;">${button(
              "View your quote",
              t.quoteUrl,
            )}</div>`,
        ),
      };
    case "quote_cancelled":
      return {
        subject: `Quote cancelled for ${t.address}`,
        text: `${t.name}, your quote request for ${t.address} (${formatCurrency(t.total)}) has been successfully cancelled.`,
        html: shell(
          "Quote Cancelled",
          p(`${t.name},`) +
            p(
              `We have successfully cancelled your quote request for <strong>${t.address}</strong>.`,
            ) +
            p("If you need anything else, just draw a new quote!"),
        ),
      };
    case "payment_receipt":
      return {
        subject: `Payment received, thank you`,
        text: `${t.name}, we've recorded your ${t.method} payment of ${formatCurrency(
          t.amount,
        )}. Thank you.`,
        html: shell(
          "Payment received",
          p(`Thank you, ${t.name}.`) +
            p(
              `We've recorded your <strong>${t.method}</strong> payment of <strong>${formatCurrency(
                t.amount,
              )}</strong>.`,
            ),
        ),
      };
    case "referral_credited":
      return {
        subject: `You earned ${t.points} reward points`,
        text: `${t.name}, a referral just paid off, ${t.points} points added to your balance.`,
        html: shell(
          "Referral reward",
          p(`Wonderful news, ${t.name}.`) +
            p(
              `A friend you referred just booked, <strong>${t.points} points</strong> have been added to your balance.`,
            ),
        ),
      };
  }
}
