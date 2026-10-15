import { useEffect } from 'react';

interface ToastProps {
  title: string;
  text?: string;
  variant?: 'info' | 'error';
  onClose: () => void;
}

export function Toast({ title, text, variant = 'info', onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast${variant === 'error' ? ' toast--error' : ''}`} role="status">
      <div className="toast__body">
        <div className="toast__title">{title}</div>
        {text && <div className="toast__text">{text}</div>}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        style={{ background: 'transparent', border: 0, color: 'inherit', cursor: 'pointer', fontSize: 18 }}
      >
        ×
      </button>
    </div>
  );
}