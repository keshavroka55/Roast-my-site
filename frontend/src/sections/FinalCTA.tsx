import { UrlRoastForm } from '../features/roast/UrlRoastForm';


export function FinalCTA() {
  return (
    <section className="section band--primary on-dark" id="roast">
      <div className="container">
        <div className="cta">
          <div>
            <p className="eyebrow">Ready when you are</p>
            <h2 className="display-xl" style={{ marginTop: 12 }}>
              Send your URL. We’ll review it thoroughly.
            </h2>
            <p className="lede" style={{ marginTop: 20 }}>
              Submit your email and site URL. We follow up with direct, human feedback on what is
              weak, what is confusing, and what to fix first.
            </p>
          </div>

          <div className="cta__form">
            <UrlRoastForm />
          </div>
        </div>
      </div>
    </section>
  );
}