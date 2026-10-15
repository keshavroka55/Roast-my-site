const escape = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function renderRoastInProgress(entry) {
  const siteLine = entry.siteUrl
    ? `<p style="margin:12px 0 0;font-size:13px;color:#e7c9cd;">Preparing: <span style="color:#fbd4d4;">${escape(entry.siteUrl)}</span></p>`
    : '';

  return {
    subject: `🔥 Your roast is being prepared`,
    text: `Good news — we're warming up the grill on your site. Sit tight, we'll have your roast ready shortly.\n\n${entry.siteUrl ? `Site: ${entry.siteUrl}` : ''}`,
    html: `<!doctype html><html><body style="margin:0;background:#f1e6ef;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:32px 20px;">
        <div style="background:#5a000f;color:#fbfbfb;padding:32px 28px;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#fbd4d4;">RoastMySite</p>
          <p style="margin:0;font-family:Georgia,serif;font-size:30px;font-weight:700;line-height:1.05;letter-spacing:-.02em;">
            Your roast is being <em style="font-style:normal;color:#fbd4d4;">prepared.</em>
          </p>
          ${siteLine}
        </div>
        <div style="background:#ffffff;padding:24px 28px;margin-top:12px;">
          <p style="margin:0;font-size:15px;line-height:1.55;color:#002622;">
            Good news — we're warming up the grill. Sit tight, we'll have your full roast
            ready shortly. When it's plated, you'll get the score, the burns, and the fix list.
          </p>
        </div>
        <p style="text-align:center;font-size:11px;color:#514b4a;margin:24px 0 0;">RoastMySite · 🔥</p>
      </div>
    </body></html>`,
  };
}