/**
 * backend/routes/admin.js — Admin API.
 *
 * No authentication: the admin panel runs on a separate port and is only
 * intended for local / trusted use. If you ever expose the admin panel to
 * the internet, add session middleware here before the route handlers.
 */
import { sendJson, readJsonBody, HttpError } from '../lib/http.js';
import { read, update } from '../lib/jsonStore.js';
import { sendMail } from '../lib/mailer.js';
import { renderRoastInProgress } from '../email-templates/roast-in-progress.js';

const VALID_STATUSES = new Set(['pending', 'notice_sent', 'roasting', 'done', 'declined']);

export async function handleAdmin(req, res, pathname) {
  // GET /api/admin/waitlist
  if (pathname === '/api/admin/waitlist' && req.method === 'GET') {
    const data = await read();
    return sendJson(res, 200, {
      waitlist: data.waitlist,
      roasts: data.roasts,
    });
  }

  // POST /api/admin/waitlist/:id/send-notice
  const noticeMatch = pathname.match(/^\/api\/admin\/waitlist\/([^/]+)\/send-notice$/);
  if (noticeMatch && req.method === 'POST') {
    const id = noticeMatch[1];

    let target = null;
    const result = await update((data) => {
      const entry = data.waitlist.find((w) => w.id === id);
      if (!entry) return data;
      target = entry;
      if (entry.status === 'pending') {
        entry.status = 'notice_sent';
        entry.noticeSentAt = new Date().toISOString();
      }
      return data;
    });

    if (!target) throw new HttpError(404, 'Entry not found.');

    const tpl = renderRoastInProgress(target);
    const sendResult = await sendMail({ to: target.email, subject: tpl.subject, html: tpl.html, text: tpl.text });

    return sendJson(res, 200, {
      ok: true,
      entry: target,
      email: sendResult,
    });
  }

  // POST /api/admin/waitlist/:id/status   { status }
  const statusMatch = pathname.match(/^\/api\/admin\/waitlist\/([^/]+)\/status$/);
  if (statusMatch && req.method === 'POST') {
    const id = statusMatch[1];
    const body = await readJsonBody(req);
    const next = String(body.status ?? '');
    if (!VALID_STATUSES.has(next)) throw new HttpError(400, 'Invalid status.');

    let updated = null;
    await update((data) => {
      const entry = data.waitlist.find((w) => w.id === id);
      if (!entry) return data;
      entry.status = next;
      if (next === 'roasting' && !entry.roastStartedAt) entry.roastStartedAt = new Date().toISOString();
      if (next === 'done') entry.roastCompletedAt = new Date().toISOString();
      updated = entry;
      return data;
    });

    if (!updated) throw new HttpError(404, 'Entry not found.');
    return sendJson(res, 200, { ok: true, entry: updated });
  }

  // DELETE /api/admin/waitlist/:id
  const deleteMatch = pathname.match(/^\/api\/admin\/waitlist\/([^/]+)$/);
  if (deleteMatch && req.method === 'DELETE') {
    const id = deleteMatch[1];
    let found = false;
    await update((data) => {
      const before = data.waitlist.length;
      data.waitlist = data.waitlist.filter((w) => w.id !== id);
      found = data.waitlist.length !== before;
      return data;
    });
    if (!found) throw new HttpError(404, 'Entry not found.');
    return sendJson(res, 200, { ok: true });
  }

  throw new HttpError(404, 'Admin endpoint not found.');
}