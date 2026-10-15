const SAMPLE_FINDINGS = [
  {
    roast: 'Your headline sounds like a placeholder.',
    detail: 'The page is trying to be clever before it has said what it does.',
  },
  {
    roast: 'There are too many mixed signals.',
    detail: 'The messaging, colour, and layout are all pulling in different directions.',
  },
];

export function RoastPreview() {
  return (
    <section className="section band--dark on-dark" id="sample">
      <div className="container">
        <div className="hero__grid" style={{ alignItems: 'center' }}>
          <div>
            <p className="eyebrow">Sample feedback</p>
            <h2 className="display-lg" style={{ marginTop: 12 }}>
              Honest notes. Not generic fluff.
            </h2>
            <p className="lede" style={{ marginTop: 20 }}>
              Real feedback is usually specific: what feels weak, what is confusing, and what to
              fix first. This is the kind of review a person would leave after reading the page.
            </p>
            <div style={{ marginTop: 28 }}>
              <a className="btn btn--inverse btn--lg" href="#waitlist">
                Request a review
              </a>
            </div>
          </div>

          <div className="card card--surface">
            <div className="meter">
              <div className="meter__top">
                <span className="meter__value">78</span>
                <span className="eyebrow" style={{ color: 'var(--c-link)' }}>
                  Review score
                </span>
              </div>
              <div className="meter__track">
                <div className="meter__fill" style={{ width: '78%' }} />
              </div>
            </div>

            <ul style={{ marginTop: 28, display: 'grid', gap: 20 }}>
              {SAMPLE_FINDINGS.map((item) => (
                <li key={item.roast}>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      fontWeight: 700,
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                      color: 'var(--c-on-dark)',
                    }}
                  >
                    {item.roast}
                  </p>
                  <p
                    style={{
                      marginTop: 6,
                      fontSize: 'var(--fs-body-sm)',
                      lineHeight: 1.5,
                      color: 'var(--c-on-dark-muted)',
                    }}
                  >
                    {item.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}