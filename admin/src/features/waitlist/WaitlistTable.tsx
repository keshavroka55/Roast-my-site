import { useState } from 'react';
import type { WaitlistEntry } from '../../types';
import { StatusPill } from '../../components/StatusPill';
import { Button } from '../../components/Button';
import { sendNotice, updateStatus, deleteEntry } from '../../api/admin';

interface Props {
  entries: WaitlistEntry[];
  onChanged: () => void;
  onToast: (t: { title: string; text?: string; variant?: 'info' | 'error' }) => void;
}

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : '—');
const rel = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export function WaitlistTable({ entries, onChanged, onToast }: Props) {
  const [busy, setBusy] = useState<string | null>(null);

  async function handleSendNotice(entry: WaitlistEntry) {
    setBusy(entry.id);
    try {
      const result = await sendNotice(entry.id);
      onToast({
        title: result.email.sent ? 'Notice sent.' : 'Notice saved, but email not sent.',
        text: result.email.sent
          ? `We told ${entry.email} to sit tight.`
          : 'Check SMTP config in the backend .env.',
        variant: result.email.sent ? 'info' : 'error',
      });
      onChanged();
    } catch (err) {
      onToast({ title: 'Send failed', text: err instanceof Error ? err.message : 'Try again.', variant: 'error' });
    } finally {
      setBusy(null);
    }
  }

  async function handleStatus(entry: WaitlistEntry, status: WaitlistEntry['status']) {
    setBusy(entry.id);
    try {
      await updateStatus(entry.id, status);
      onChanged();
    } catch (err) {
      onToast({ title: 'Update failed', text: err instanceof Error ? err.message : 'Try again.', variant: 'error' });
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete(entry: WaitlistEntry) {
    if (!confirm(`Delete ${entry.email}? This cannot be undone.`)) return;
    setBusy(entry.id);
    try {
      await deleteEntry(entry.id);
      onToast({ title: 'Deleted', text: `${entry.email} removed.` });
      onChanged();
    } catch (err) {
      onToast({ title: 'Delete failed', text: err instanceof Error ? err.message : 'Try again.', variant: 'error' });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Site</th>
            <th>Joined</th>
            <th>Status</th>
            <th>Notice sent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const isBusy = busy === entry.id;
            return (
              <tr key={entry.id}>
                <td className="cell-email">{entry.email}</td>
                <td className="cell-url">{entry.siteUrl || '—'}</td>
                <td className="cell-date" title={new Date(entry.joinedAt).toLocaleString()}>
                  {rel(entry.joinedAt)}
                </td>
                <td><StatusPill status={entry.status} /></td>
                <td className="cell-date">{fmt(entry.noticeSentAt)}</td>
                <td>
                  <div className="cell-actions">
                    {entry.status === 'pending' && (
                      <Button size="sm" disabled={isBusy} onClick={() => handleSendNotice(entry)}>
                        {isBusy ? 'Sending…' : 'Send notice'}
                      </Button>
                    )}
                    {entry.status === 'notice_sent' && (
                      <Button size="sm" variant="outline" disabled={isBusy} onClick={() => handleStatus(entry, 'roasting')}>
                        Mark roasting
                      </Button>
                    )}
                    {entry.status === 'roasting' && (
                      <Button size="sm" variant="outline" disabled={isBusy} onClick={() => handleStatus(entry, 'done')}>
                        Mark done
                      </Button>
                    )}
                    <Button size="sm" variant="danger" disabled={isBusy} onClick={() => handleDelete(entry)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}