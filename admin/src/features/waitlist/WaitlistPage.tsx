import { useMemo, useState } from 'react';
import { useAdminData } from './useAdminData';
import { WaitlistTable } from './WaitlistTable';
import { Toast } from '../../components/Toast';
import type { WaitlistStatus } from '../../types';

const FILTERS: Array<{ label: string; value: WaitlistStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Notice sent', value: 'notice_sent' },
  { label: 'Roasting', value: 'roasting' },
  { label: 'Done', value: 'done' },
];

export function WaitlistPage() {
  const { data, loading, error, reload } = useAdminData();
  const [filter, setFilter] = useState<WaitlistStatus | 'all'>('all');
  const [toast, setToast] = useState<{ title: string; text?: string; variant?: 'info' | 'error' } | null>(null);

  const rows = useMemo(() => {
    if (!data) return [];
    return filter === 'all' ? data.waitlist : data.waitlist.filter((w) => w.status === filter);
  }, [data, filter]);

  return (
    <>
      <header className="admin-header">
        <div>
          <span className="eyebrow">Waitlist</span>
          <h1>Everyone who wants a roast.</h1>
          <p className="admin-header__sub">
            Send the "sit tight" notice, mark entries as roasting, or remove them.
          </p>
        </div>
      </header>

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className="filter-chip"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p className="cell-date">Loading…</p>}
      {error && <p className="field__error">{error}</p>}

      {!loading && !error && rows.length === 0 && (
        <div className="admin-empty">
          <h2>Nothing here yet.</h2>
          <p>New signups will appear the moment someone joins.</p>
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <WaitlistTable
          entries={rows}
          onChanged={() => void reload()}
          onToast={(t) => setToast(t)}
        />
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );
}