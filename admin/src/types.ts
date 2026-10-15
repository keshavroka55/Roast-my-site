export type WaitlistStatus = 'pending' | 'notice_sent' | 'roasting' | 'done' | 'declined';

export interface WaitlistEntry {
  id: string;
  email: string;
  siteUrl: string;
  joinedAt: string;
  status: WaitlistStatus;
  noticeSentAt: string | null;
  roastStartedAt: string | null;
  roastCompletedAt: string | null;
  notes: string;
}

export interface RoastSummary {
  id: string;
  url: string;
  score: number;
  verdict: string;
  findings: number;
  createdAt: string;
}

export interface AdminData {
  waitlist: WaitlistEntry[];
  roasts: RoastSummary[];
}