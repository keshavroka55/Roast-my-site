import { WaitlistForm } from '../features/waitlist/WaitlistForm';

export function HeroSection() {
  return (
    <section className="hero" id="waitlist">
      <div className="container">
        <div className="hero__grid">
          <div>
            <p className="eyebrow">Manual website feedback, no fluff</p>
            <h1 className="display-xxl hero__title">
              Leave your URL. <em>A person</em> will review it.
            </h1>
            <p className="lede hero__lede">
              Send your email and site URL. We manually review the page, call out what is weak,
              and give you clear, useful feedback you can actually act on. No AI verdicts. No script
              spam. Just honest human feedback.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary btn--lg" href="#waitlist">
                Request a review
              </a>
              <a className="btn btn--text" href="#how-it-works">
                See how it works
              </a>
            </div>
          </div>

          <aside className="hero-panel" aria-labelledby="waitlist-heading">
            <div className="hero-panel__glow" aria-hidden="true" />

            <div className="hero-panel__body">
              <p className="hero-panel__eyebrow">
                <span className="hero-panel__dot" aria-hidden="true" />
                Early access · Open
              </p>

              <h2 id="waitlist-heading" className="display-md hero-panel__heading">
                The full roast is still <em>plating.</em>
              </h2>

              <p className="hero-panel__lede">
                Screenshots. Mobile rendering. Prioritised fixes. Leave an email and we'll send
                the key when the kitchen opens.
              </p>

              <div className="hero-panel__form">
                <WaitlistForm
                  onDark
                  stacked
                  successTitle="You're on the list."
                  successBody="Sit tight — we'll email you shortly with your roast and when it's ready to serve."
                  duplicateTitle="You're already on the list."
                  duplicateBody="We remember you. Your roast is already being prepared."
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}