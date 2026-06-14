/**
 * lib/services/emailService.ts
 *
 * Phase 2 — transactional email notifications via Resend (free tier).
 *
 * Auth: set RESEND_API_KEY (Resend dashboard). Free tier: 100 emails/day,
 * 3,000/month — enough for a PoC. Set EMAIL_FROM to a verified sender; until a
 * domain is verified, Resend's "onboarding@resend.dev" only delivers to the
 * account owner's address.
 *
 * Graceful fallback: with no RESEND_API_KEY, sends are *simulated* (logged) so
 * the app never breaks and no paid plan is required.
 */
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const EMAIL_FROM = process.env.EMAIL_FROM || "PropChain <onboarding@resend.dev>";
const RESEND_URL = "https://api.resend.com/emails";

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
}

export interface SendEmailResult {
  id: string | null;
  simulated: boolean;
}

export function isEmailConfigured(): boolean {
  return RESEND_API_KEY.length > 0;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (!isEmailConfigured()) {
    console.log(
      `[email:simulated] to=${input.to} subject="${input.subject}" (set RESEND_API_KEY to actually send)`
    );
    return { id: null, simulated: true };
  }

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: Array.isArray(input.to) ? input.to : [input.to],
      subject: input.subject,
      html: input.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend send failed: ${res.status} ${body}`);
  }
  const json = (await res.json()) as { id?: string };
  return { id: json.id ?? null, simulated: false };
}

// ── Branded template ─────────────────────────────────────────────────────────
function layout(title: string, body: string): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#191c21">
    <div style="background:#0050b2;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
      <h1 style="margin:0;font-size:18px">PropChain</h1>
    </div>
    <div style="border:1px solid #eee;border-top:0;padding:24px;border-radius:0 0 12px 12px">
      <h2 style="font-size:16px;margin:0 0 12px">${title}</h2>
      ${body}
      <p style="color:#888;font-size:12px;margin-top:24px">
        PropChain is a proof-of-concept. Smart-contract transfers are simulations and are not legally binding.
      </p>
    </div>
  </div>`;
}

const row = (label: string, value: string) =>
  `<p style="margin:6px 0"><strong>${label}:</strong> ${value}</p>`;

export function notifyPropertyApproved(opts: {
  to: string;
  ulpin: string;
  tokenId: number | string;
  txHash?: string;
}) {
  return sendEmail({
    to: opts.to,
    subject: `Property ${opts.ulpin} approved`,
    html: layout(
      "Your property was approved ✅",
      row("ULPIN", opts.ulpin) +
        row("Token ID", String(opts.tokenId)) +
        (opts.txHash ? row("Tx", opts.txHash) : "")
    ),
  });
}

export function notifyPropertyRejected(opts: {
  to: string;
  ulpin: string;
  reason: string;
}) {
  return sendEmail({
    to: opts.to,
    subject: `Property ${opts.ulpin} rejected`,
    html: layout(
      "Your property submission was rejected",
      row("ULPIN", opts.ulpin) + row("Reason", opts.reason)
    ),
  });
}

export function notifyTransfer(opts: {
  to: string;
  ulpin: string;
  from: string;
  toWallet: string;
}) {
  return sendEmail({
    to: opts.to,
    subject: `Ownership transfer for ${opts.ulpin}`,
    html: layout(
      "Ownership transferred",
      row("ULPIN", opts.ulpin) + row("From", opts.from) + row("To", opts.toWallet)
    ),
  });
}

export function notifyLienChange(opts: {
  to: string;
  ulpin: string;
  action: "added" | "released";
  amount?: number;
}) {
  return sendEmail({
    to: opts.to,
    subject: `Encumbrance ${opts.action} on ${opts.ulpin}`,
    html: layout(
      `Lien ${opts.action}`,
      row("ULPIN", opts.ulpin) +
        (opts.amount ? row("Amount", String(opts.amount)) : "")
    ),
  });
}

export function notifyDispute(opts: {
  to: string;
  ulpin: string;
  action: "raised" | "resolved";
  detail: string;
}) {
  return sendEmail({
    to: opts.to,
    subject: `Dispute ${opts.action} on ${opts.ulpin}`,
    html: layout(
      `Dispute ${opts.action}`,
      row("ULPIN", opts.ulpin) + row("Detail", opts.detail)
    ),
  });
}
