import { useAdminData } from '../waitlist/useAdminData';

const rel = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export function RoastsPage() {
  const { data, loading, error } = useAdminData();

  return (
    <>
      <header className="admin-header">
        <div>
          <span className="eyebrow">Roasts</span>
          <h1>Recent roasts.</h1>
          <p className="admin-header__sub">The last 200 roasts served by the API.</p>
        </div>
      </header>

      {loading && <p className="cell-date">Loading…</p>}
      {error && <p className="field__error">{error}</p>}

      {!loading && !error && data && data.roasts.length === 0 && (
        <div className="admin-empty">
          <h2>No roasts yet.</h2>
          <p>Once someone submits a URL, the roast will show up here.</p>
        </div>
      )}

      {!loading && !error && data && data.roasts.length > 0 && (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Score</th>
                <th>Verdict</th>
                <th>Findings</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {data.roasts.map((r) => (
                <tr key={r.id}>
                  <td className="cell-url">{r.url}</td>
                  <td style={{ fontWeight: 700 }}>{r.score}</td>
                  <td>{r.verdict}</td>
                  <td>{r.findings}</td>
                  <td className="cell-date" title={new Date(r.createdAt).toLocaleString()}>
                    {rel(r.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}