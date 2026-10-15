import type { AdminData, WaitlistEntry, WaitlistStatus } from '../types';

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    });
  } catch {
    throw new ApiError(0, "Couldn't reach the server.");
  }
  let payload: unknown = null;
  try { payload = await res.json(); } catch { /* */ }
  if (!res.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload
        ? String((payload as { error: unknown }).error)
        : `Request failed (${res.status}).`;
    throw new ApiError(res.status, message);
  }
  return payload as T;
}

export function fetchAdminData(): Promise<AdminData> {
  return request<AdminData>('/api/admin/waitlist');
}

export function sendNotice(id: string): Promise<{ ok: boolean; entry: WaitlistEntry; email: { sent: boolean } }> {
  return request(`/api/admin/waitlist/${id}/send-notice`, { method: 'POST' });
}

export function updateStatus(id: string, status: WaitlistStatus): Promise<{ ok: boolean; entry: WaitlistEntry }> {
  return request(`/api/admin/waitlist/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

export function deleteEntry(id: string): Promise<{ ok: boolean }> {
  return request(`/api/admin/waitlist/${id}`, { method: 'DELETE' });
}

export { ApiError };