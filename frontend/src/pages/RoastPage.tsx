import { Link } from 'react-router-dom';
import { UrlRoastForm } from '../features/roast/UrlRoastForm';


export function RoastPage() {
  return (
    <main className="roast-page">
      <div className="container">
        <div className="roast-page__head">
          <p className="eyebrow">Live roast</p>
          <h1 className="display-xl" style={{ marginTop: 12 }}>
            Paste a URL. Brace for feedback.
          </h1>
          <p className="lede" style={{ marginTop: 20 }}>
            We fetch the page server-side and read the HTML that comes back. Every finding cites the
            measurement that produced it — and tells you whether we measured it or inferred it.
          </p>
        </div>

        <div className="roast-form">
          <UrlRoastForm />
        </div>

        <div style={{ marginTop: 48 }}>
          <Link to="/" className="btn btn--text">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}