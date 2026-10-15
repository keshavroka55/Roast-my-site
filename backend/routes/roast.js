import { sendJson, readJsonBody, HttpError } from '../lib/http.js';
import { roastUrl } from '../roast/index.js';
import { sendMail } from '../lib/mailer.js';
import { renderRoastReport } from '../email-templates/roast-report.js';
import { update } from '../lib/jsonStore.js';

export async function handleRoast(req, res) {
  if (req.method !== 'POST') throw new HttpError(405, 'Use POST for this endpoint.');

  const body = await readJsonBody(req);
  const url = typeof body.url === 'string' ? body.url.trim() : '';
  if (!url) throw new HttpError(400, 'Paste a URL first.');

  const report = await roastUrl(url);

  // Record the roast.
  void update((data) => {
    data.roasts.unshift({
      id: 'r_' + Date.now().toString(36),
      url: report.finalUrl,
      score: report.score,
      verdict: report.verdict,
      findings: report.findings.length,
      createdAt: report.fetchedAt,
    });
    data.roasts = data.roasts.slice(0, 200);
    return data;
  });

  // Fire-and-forget email.
  const tpl = renderRoastReport(report);
  void sendMail({ subject: tpl.subject, html: tpl.html, text: tpl.text });

  sendJson(res, 200, report);
}