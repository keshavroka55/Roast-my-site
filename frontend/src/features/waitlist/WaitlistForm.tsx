import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { joinWaitlist } from '../../api/public';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface WaitlistFormProps {
  onDark?: boolean;
  stacked?: boolean;
  successTitle?: string;
  successBody?: string;
  duplicateTitle?: string;
  duplicateBody?: string;
}

export function WaitlistForm({
  onDark = false,
  stacked = false,
  successTitle = "You're on the list.",
  successBody = "Sit tight — we'll email you shortly with your roast and when it's ready to serve.",
  duplicateTitle = "You're already on the list.",
  duplicateBody = "We remember you. Your roast is already being prepared.",
}: WaitlistFormProps) {
  const emailId = useId();
  const urlId = useId();
  const emailErrorId = `${emailId}-error`;
  const urlErrorId = `${urlId}-error`;
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  const [email, setEmail] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedUrl, setSubmittedUrl] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [wasDuplicate, setWasDuplicate] = useState(false);

  // Focus the confirmation heading when the success state appears.
  useEffect(() => {
    if (status === 'success' && successHeadingRef.current) {
      successHeadingRef.current.focus();
    }
  }, [status]);

  // Clear stale error text as soon as the user edits the fields again.
  useEffect(() => {
    if (status === 'error') {
      setStatus('idle');
      setMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, siteUrl]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;

    const eVal = email.trim();
    const uVal = siteUrl.trim();
    let ok = true;

    if (!eVal) {
      setEmailError('We need an email to put you on the list.');
      ok = false;
    } else if (!EMAIL_RE.test(eVal)) {
      setEmailError("That doesn't look like an email address.");
      ok = false;
    } else {
      setEmailError(null);
    }

    if (!uVal) {
      setUrlError('Add a site we can roast.');
      ok = false;
    } else if (!URL_RE.test(uVal)) {
      setUrlError("That doesn't look like a website URL.");
      ok = false;
    } else {
      setUrlError(null);
    }

    if (!ok) return;

    setStatus('submitting');

    try {
      const result = await joinWaitlist(eVal, uVal);
      setSubmittedEmail(eVal);
      setSubmittedUrl(uVal);
      setWasDuplicate(result.alreadyRegistered);
      setStatus('success');
      setMessage(null);
      setEmail('');
      setSiteUrl('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
  }

  function resetForm() {
    setStatus('idle');
    setMessage(null);
    setSubmittedEmail('');
    setSubmittedUrl('');
    setWasDuplicate(false);
  }

  const formClass = stacked ? 'waitlist-form waitlist-form--stacked' : 'waitlist-form';

  /* ---------- Success state ---------- */
  if (status === 'success') {
    const title = wasDuplicate ? duplicateTitle : successTitle;
    const body = wasDuplicate ? duplicateBody : successBody;

    return (
      <div className={`waitlist-success${onDark ? ' waitlist-success--dark' : ''}`}>
        <div className="waitlist-success__icon" aria-hidden="true">
          {wasDuplicate ? '✓' : '🔥'}
        </div>

        <h3
          ref={successHeadingRef}
          tabIndex={-1}
          className="waitlist-success__title"
        >
          {title}
        </h3>

        <p className="waitlist-success__body">{body}</p>

        <dl className="waitlist-success__details">
          <div>
            <dt>Email</dt>
            <dd>{submittedEmail}</dd>
          </div>
          {submittedUrl && (
            <div>
              <dt>Site</dt>
              <dd>{submittedUrl}</dd>
            </div>
          )}
        </dl>

        <div className="waitlist-success__actions">
          <Button variant="outline-light" size="md" onClick={resetForm}>
            Add another email
          </Button>
        </div>

        <p className="waitlist-success__note" aria-live="polite">
          Check your inbox — a confirmation is on its way.
        </p>
      </div>
    );
  }

  /* ---------- Form state ---------- */
  return (
    <form className={formClass} onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor={emailId}>Email address</label>
        <input
          id={emailId}
          className="field__control"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          required
          aria-invalid={emailError ? 'true' : 'false'}
          aria-describedby={emailError ? emailErrorId : undefined}
          disabled={status === 'submitting'}
        />
        {emailError && (
          <p className="field__error" id={emailErrorId} role="alert">{emailError}</p>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor={urlId}>Your website URL</label>
        <input
          id={urlId}
          className="field__control"
          type="text"
          name="siteUrl"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
          placeholder="yourdomain.com"
          autoComplete="url"
          inputMode="url"
          spellCheck={false}
          required
          aria-invalid={urlError ? 'true' : 'false'}
          aria-describedby={urlError ? urlErrorId : undefined}
          disabled={status === 'submitting'}
        />
        {urlError && (
          <p className="field__error" id={urlErrorId} role="alert">{urlError}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Adding you…' : 'Join the waitlist'}
      </Button>

      {!emailError && !urlError && (
        <p className="field__hint" style={onDark ? { color: 'var(--c-on-dark-muted)' } : undefined}>
          One email when the full product ships. No newsletter, no drip sequence.
        </p>
      )}

      <div aria-live="polite">
        {message && status === 'error' && <p className="form-status form-status--error">{message}</p>}
      </div>
    </form>
  );
}