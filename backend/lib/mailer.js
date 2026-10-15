/**
 * backend/lib/mailer.js — Nodemailer wrapper. Sends rendered templates.
 *
 * Configured via env:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, REPORT_TO
 */
import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? 587);
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

export async function sendMail({ to, subject, html, text }) {
  const mailer = getTransporter();
  if (!mailer) {
    console.log('[mailer] ✖ SMTP not configured — skipping email.');
    return { sent: false, reason: 'not-configured' };
  }

  const recipient = to ?? process.env.REPORT_TO ?? process.env.SMTP_USER;
  if (!recipient) {
    console.log('[mailer] ✖ No recipient configured — skipping email.');
    return { sent: false, reason: 'no-recipient' };
  }

  console.log(`[mailer] → Sending "${subject}" to ${recipient}…`);

  try {
    const info = await mailer.sendMail({
      from: `"RoastMySite" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject,
      html,
      text,
    });
    console.log(`[mailer] ✔ Sent to ${recipient} (${info.messageId})`);
    return { sent: true, to: recipient, messageId: info.messageId };
  } catch (err) {
    console.error(`[mailer] ✖ Failed for ${recipient}:`, err.message ?? err);
    return { sent: false, reason: 'send-failed', error: err.message };
  }
}

export function isMailerConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}