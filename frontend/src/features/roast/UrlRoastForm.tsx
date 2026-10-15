import { useState } from 'react';
import { Button } from '../../components/Button';
import { requestRoast } from '../../api/public';
import type { RoastReport as RoastReportType } from '../../types';
import { RoastReport } from './RoastReport';

type Status = 'idle' | 'loading' | 'done' | 'error';

export function UrlRoastForm() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<RoastReportType | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'loading') return;

    const value = url.trim();
    if (!value) {
      setError('Paste a URL and we’ll get the grill going.');
      return;
    }

    setError(null);
    setStatus('loading');
    setReport(null);

    try {
      const result = await requestRoast(value);
      setReport(result);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The roast failed. Try again.');
      setStatus('error');
    }
  }

  return (
    <div>
      <form className="inline-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="field__label" htmlFor="roast-url">
            Website URL
          </label>
          <input
            id="roast-url"
            className="field__control"
            type="text"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourdomain.com"
            autoComplete="url"
            inputMode="url"
            spellCheck={false}
            required
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'roast-url-error' : undefined}
            disabled={status === 'loading'}
          />
        </div>
        <Button
          type="submit"
          variant="inverse"
          size="lg"
          disabled={status === 'loading'}
          style={{ marginTop: 24 }}
        >
          {status === 'loading' ? 'Cooking…' : 'Roast my site'}
        </Button>
      </form>

      {error && (
        <p className="field__error" id="roast-url-error" role="alert" style={{ marginTop: 12 }}>
          {error}
        </p>
      )}

      <div aria-live="polite">
        {status === 'loading' && (
          <p className="roast-loading">
            <span className="spinner" aria-hidden="true" />
            Fetching your HTML and reading it line by line. This takes a few seconds.
          </p>
        )}
      </div>

      {report && <RoastReport report={report} onReset={() => { setReport(null); setUrl(''); setStatus('idle'); }} />}
    </div>
  );
}