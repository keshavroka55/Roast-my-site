import type { WaitlistStatus } from '../types';

const LABEL: Record<WaitlistStatus, string> = {
  pending: 'Pending',
  notice_sent: 'Notice sent',
  roasting: 'Roasting',
  done: 'Done',
  declined: 'Declined',
};

export function StatusPill({ status }: { status: WaitlistStatus }) {
  return <span className={`pill pill--${status}`}>{LABEL[status]}</span>;
}