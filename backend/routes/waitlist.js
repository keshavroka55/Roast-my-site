import { sendJson, readJsonBody, HttpError } from '../lib/http.js';
import { requireEmail, optionalString } from '../lib/validate.js';
import { update } from '../lib/jsonStore.js';
import { sendMail } from '../lib/mailer.js';
import { renderWaitlistConfirmation } from '../email-templates/waitlist-confirmation.js';

function newId() {
  return 'wl_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function handleWaitlist(req, res) {
  if (req.method !== 'POST') throw new HttpError(405, 'Use POST for this endpoint.');

  const body = await readJsonBody(req);
  const email = requireEmail(body.email);
  const siteUrl = optionalString(body.siteUrl, { max: 500 });

  const entry = {
    id: newId(),
    email,
    siteUrl,
    joinedAt: new Date().toISOString(),
    status: 'pending',
    noticeSentAt: null,
    roastStartedAt: null,
    roastCompletedAt: null,
    notes: '',
  };

  const result = await update((data) => {
    const existing = data.waitlist.find((w) => w.email === email);
    if (existing) return data; // no-op; already on the list
    data.waitlist.unshift(entry);
    return data;
  });

  const alreadyRegistered = result.waitlist.some((w) => w.email === email && w.id !== entry.id);

  if (!alreadyRegistered) {
    const tpl = renderWaitlistConfirmation(entry);
    void sendMail({ to: process.env.REPORT_TO ?? email, subject: tpl.subject, html: tpl.html, text: tpl.text });
  }

  sendJson(res, alreadyRegistered ? 200 : 201, {
    ok: true,
    alreadyRegistered,
    message: alreadyRegistered
      ? 'That email is already on the waitlist.'
      : 'Added to the waitlist.',
  });
}