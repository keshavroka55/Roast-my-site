/**
 * backend/api.js — Router. Mounts all API handlers.
 */
import { sendJson, HttpError } from './lib/http.js';
import { handleWaitlist } from './routes/waitlist.js';
import { handleRoast } from './routes/roast.js';
import { handleAdmin } from './routes/admin.js';

export async function handleApi(req, res, next) {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const { pathname } = url;

  try {
    if (pathname === '/api/health') {
      return sendJson(res, 200, { ok: true });
    }

    if (pathname === '/api/waitlist') {
      return await handleWaitlist(req, res);
    }

    if (pathname === '/api/roast') {
      return await handleRoast(req, res);
    }

    if (pathname.startsWith('/api/admin/')) {
      return await handleAdmin(req, res, pathname);
    }

    if (typeof next === 'function') return next();
    return sendJson(res, 404, { error: 'Not found.' });
  } catch (err) {
    if (err instanceof HttpError) {
      return sendJson(res, err.status, { error: err.message });
    }
    console.error('[api] unhandled error:', err);
    return sendJson(res, 500, { error: 'Something broke on our end. Try again in a moment.' });
  }
}