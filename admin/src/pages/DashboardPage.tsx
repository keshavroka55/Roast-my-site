import { useAdminData } from '../features/waitlist/useAdminData';

export function DashboardPage() {
  const { data, loading } = useAdminData();

  const pending = data?.waitlist.filter((w) => w.status === 'pending').length ?? 0;
  const noticeSent = data?.waitlist.filter((w) => w.status === 'notice_sent').length ?? 0;
  const done = data?.waitlist.filter((w) => w.status === 'done').length ?? 0;
  const total = data?.waitlist.length ?? 0;

  return (
    <>
      <header className="admin-header">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Dashboard.</h1>
          <p className="admin-header__sub">What's happening with the waitlist right now.</p>
        </div>
      </header>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-card__label">Total signups</span>
          <span className="stat-card__value">{loading ? '—' : total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Pending</span>
          <span className="stat-card__value">{loading ? '—' : pending}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Notice sent</span>
          <span className="stat-card__value">{loading ? '—' : noticeSent}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">Done</span>
          <span className="stat-card__value">{loading ? '—' : done}</span>
        </div>
      </div>

      <p className="admin-header__sub">
        Head to <strong>Waitlist</strong> to send the "sit tight" notice or mark entries as roasting.
      </p>
    </>
  );
}