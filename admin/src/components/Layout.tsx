import { NavLink, Outlet } from 'react-router-dom';
import { useAdminData } from '../features/waitlist/useAdminData.ts';
import { useEffect, useState } from 'react';
import { fetchAdminData } from '../api/admin';
import type { AdminData } from '../types';

export function Layout() {
  const [data, setData] = useState<AdminData | null>(null);

  useEffect(() => {
    fetchAdminData().then(setData).catch(() => setData({ waitlist: [], roasts: [] }));
  }, []);

  const pendingCount = data?.waitlist.filter((w) => w.status === 'pending').length ?? 0;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand__flame" aria-hidden="true">🔥</span>
          <span>
            RoastMySite
            <span className="admin-brand__tag">Admin</span>
          </span>
        </div>

        <nav className="admin-nav">
          <NavLink to="/dashboard" end>Dashboard</NavLink>
          <NavLink to="/waitlist">
            <span>Waitlist</span>
            {pendingCount > 0 && <span className="admin-nav__count">{pendingCount}</span>}
          </NavLink>
          <NavLink to="/roasts">Roasts</NavLink>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}