import { Button } from '../../components/Button.tsx';
import type { Finding, RoastReport as RoastReportType, Severity } from '../../types.ts';

const SEVERITY_LABEL: Record<Severity, string> = {
  toasted: 'Toasted',
  charred: 'Charred',
  cremated: 'Cremated',
};

const CATEGORY_ORDER = [
  'Content clarity',
  'Visual design',
  'Usability',
  'Navigation',
  'Mobile experience',
] as const;

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <article className={`finding finding--${finding.severity}`}>
      <div className="finding__head">
        <span className="finding__category">{finding.category}</span>
        <span className={`verdict verdict--${finding.severity}`}>{SEVERITY_LABEL[finding.severity]}</span>
        <span className={`badge badge--${finding.confidence}`}>
          {finding.confidence === 'measured' ? 'Measured' : 'Inferred'}
        </span>
      </div>
      <p className="finding__roast">{finding.roast}</p>
      <p className="finding__observation">{finding.observation}</p>
      <p className="finding__fix">{finding.fix}</p>
      <p className="finding__evidence">{finding.evidence}</p>
    </article>
  );
}

interface RoastReportProps {
  report: RoastReportType;
  onReset: () => void;
}

export function RoastReport({ report, onReset }: RoastReportProps) {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: report.findings.filter((f) => f.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <section className="report" aria-label="Roast report">
      <header className="report__header">
        <div>
          <p className="eyebrow" style={{ color: 'var(--c-link)' }}>
            Roast report
          </p>
          <p className="report__site">{report.finalUrl}</p>
        </div>
        <span className={`verdict verdict--${report.findings[0]?.severity ?? 'toasted'}`}>
          {report.verdict}
        </span>
      </header>

      <div className="meter" style={{ marginTop: 28 }}>
        <div className="meter__top">
          <span className="meter__value" style={{ color: 'var(--c-on-dark)' }}>
            {report.score}
          </span>
          <span className="eyebrow" style={{ color: 'var(--c-link)' }}>
            Cook meter · higher is worse
          </span>
        </div>
        <div
          className="meter__track"
          role="progressbar"
          aria-valuenow={report.score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Cook meter"
        >
          <div className="meter__fill" style={{ width: `${report.score}%` }} />
        </div>
      </div>

      <p className="report__summary" style={{ marginTop: 20 }}>
        {report.summary}
      </p>

      <dl
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px 40px',
          marginTop: 28,
          paddingTop: 20,
          borderTop: '1px solid rgba(251,212,212,0.2)',
        }}
      >
        <div>
          <dt className="eyebrow" style={{ color: 'var(--c-link)' }}>
            HTML size
          </dt>
          <dd style={{ color: 'var(--c-on-dark)', fontWeight: 700 }}>
            {(report.stats.htmlBytes / 1024).toFixed(1)} KB
          </dd>
        </div>
        <div>
          <dt className="eyebrow" style={{ color: 'var(--c-link)' }}>
            Fetch time
          </dt>
          <dd style={{ color: 'var(--c-on-dark)', fontWeight: 700 }}>{report.stats.fetchMs} ms</dd>
        </div>
        <div>
          <dt className="eyebrow" style={{ color: 'var(--c-link)' }}>
            Words
          </dt>
          <dd style={{ color: 'var(--c-on-dark)', fontWeight: 700 }}>
            {report.stats.wordCount.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="eyebrow" style={{ color: 'var(--c-link)' }}>
            Images
          </dt>
          <dd style={{ color: 'var(--c-on-dark)', fontWeight: 700 }}>{report.stats.imageCount}</dd>
        </div>
        <div>
          <dt className="eyebrow" style={{ color: 'var(--c-link)' }}>
            Scripts
          </dt>
          <dd style={{ color: 'var(--c-on-dark)', fontWeight: 700 }}>{report.stats.scriptCount}</dd>
        </div>
      </dl>

      {grouped.map((group) => (
        <div className="report__section" key={group.category}>
          <h3 className="report__section-title" style={{ color: 'var(--c-link)' }}>
            {group.category} · {group.items.length}
          </h3>
          <div className="findings">
            {group.items.map((finding) => (
              <FindingCard key={finding.id} finding={finding} />
            ))}
          </div>
        </div>
      ))}

      {report.findings.length === 0 && (
        <div className="empty-state" style={{ background: 'rgba(251,212,212,0.12)' }}>
          <p className="display-md" style={{ color: 'var(--c-on-dark)' }}>
            Nothing to roast.
          </p>
          <p className="lede" style={{ color: 'var(--c-on-dark-muted)', marginTop: 12 }}>
            Every check we run came back clean. We're as disappointed as you are.
          </p>
        </div>
      )}

      <div className="disclaimer">
        <h3>What we actually did (and didn't do)</h3>
        <p>
          We fetched the HTML at <code>{report.finalUrl}</code> on{' '}
          {new Date(report.fetchedAt).toLocaleString()} and read the markup. That's it.
        </p>
        <ul>
          {report.notMeasured.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p style={{ marginTop: 12 }}>
          Findings tagged <strong>Measured</strong> come straight from the markup. Findings tagged{' '}
          <strong>Inferred</strong> are educated guesses from indirect signals — treat them as
          leads, not verdicts.
        </p>
      </div>

      <div style={{ marginTop: 32 }}>
        <Button variant="inverse" size="lg" onClick={onReset}>
          Roast another site
        </Button>
      </div>
    </section>
  );
}