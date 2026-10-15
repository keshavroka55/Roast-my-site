const escape = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const SEVERITY_COLOR = { toasted: '#cd130a', charred: '#ec180e', cremated: '#fe009b' };

function renderFindings(findings) {
  if (findings.length === 0) {
    return `<p style="color:#514b4a;">Every check came back clean. Nothing to roast.</p>`;
  }
  return findings
    .map(
      (f) => `<div style="margin:0 0 24px;padding:20px 22px;background:#ffffff;border-left:4px solid ${SEVERITY_COLOR[f.severity] ?? '#cd130a'};">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#514b4a;">
          ${escape(f.category)} · ${escape(f.severity)} · ${escape(f.confidence)}
        </p>
        <p style="margin:0 0 10px;font-size:18px;font-weight:700;color:#1b1817;line-height:1.2;">${escape(f.roast)}</p>
        <p style="margin:0 0 10px;font-size:14px;color:#002622;line-height:1.55;">${escape(f.observation)}</p>
        <p style="margin:0 0 10px;font-size:14px;color:#2d0007;font-weight:500;line-height:1.55;">
          <strong style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;">Fix —</strong>
          ${escape(f.fix)}
        </p>
        <pre style="margin:0;padding:10px 12px;background:#f1e6ef;font-size:12px;color:#514b4a;white-space:pre-wrap;word-break:break-word;">${escape(f.evidence)}</pre>
      </div>`,
    )
    .join('');
}

export function renderRoastReport(report) {
  const date = new Date(report.fetchedAt).toLocaleString();
  return {
    subject: `🔥 ${report.score} · ${report.verdict} — ${report.hostname}`,
    text: `${report.score} · ${report.verdict}\n${report.finalUrl}\n\n${report.summary}`,
    html: `<!doctype html><html><body style="margin:0;padding:0;background:#f1e6ef;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
      <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
        <div style="background:#5a000f;color:#fbfbfb;padding:32px 28px;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#fbd4d4;">RoastMySite report</p>
          <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:32px;font-weight:700;line-height:1;letter-spacing:-.02em;">
            ${report.score} · ${escape(report.verdict)}
          </p>
          <p style="margin:12px 0 0;font-size:13px;color:#e7c9cd;word-break:break-all;">${escape(report.finalUrl)}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#e7c9cd;">Fetched ${escape(date)}</p>
        </div>
        <div style="background:#ffffff;padding:24px 28px;">
          <p style="margin:0;font-size:15px;line-height:1.55;color:#002622;">${escape(report.summary)}</p>
        </div>
        <div style="background:#ffffff;padding:24px 28px;margin-top:12px;">
          <p style="margin:0 0 16px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#514b4a;">
            Findings · ${report.findings.length}
          </p>
          ${renderFindings(report.findings)}
        </div>
        <div style="background:#f1e6ef;padding:20px 28px;margin-top:12px;font-size:12px;color:#514b4a;line-height:1.55;">
          <p style="margin:0 0 8px;font-weight:700;color:#1b1817;">What we actually did (and didn't do)</p>
          <ul style="margin:0;padding-left:18px;">
            ${report.notMeasured.map((i) => `<li>${escape(i)}</li>`).join('')}
          </ul>
        </div>
        <p style="text-align:center;font-size:11px;color:#514b4a;margin:24px 0 0;">Sent by RoastMySite · 🔥</p>
      </div>
    </body></html>`,
  };
}