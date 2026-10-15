import type { RoastReport, WaitlistResponse } from '../types';

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Couldn't reach the server. Check your connection and try again.");
  }
  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch { /* non-JSON */ }
  if (!res.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload
        ? String((payload as { error: unknown }).error)
        : `Request failed (${res.status}).`;
    throw new ApiError(res.status, message);
  }
  return payload as T;
}

export function joinWaitlist(email: string, siteUrl: string): Promise<WaitlistResponse> {
  return postJson<WaitlistResponse>('/api/waitlist', { email, siteUrl });
}

export function requestRoast(url: string): Promise<RoastReport> {
  return postJson<RoastReport>('/api/roast', { url });
}

export { ApiError };