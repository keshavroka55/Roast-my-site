const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="footer">
      <div className="container container--wide">
        <div className="footer__grid">
          <div>
            <span className="wordmark">
              RoastMySite
            </span>
            <p className="footer__tagline">
              Human review for websites that need a sharper message, cleaner structure, and better
              decision-making. No script. No AI gloss. Just honest feedback.
            </p>
          </div>

          <div>
            <h2 className="footer__col-title">Product</h2>
            <ul className="footer__list">
              <li>
                <a href="#waitlist">Request a review</a>
              </li>
              <li>
                <a href="/#how-it-works">How it works</a>
              </li>
              <li>
                <a href="/#sample">Sample feedback</a>
              </li>
              <li>
                <a href="/#what-we-check">What we check</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="footer__col-title">Company</h2>
            <ul className="footer__list">
              <li>
                <a href="/#faq">FAQ</a>
              </li>
              <li>
                <a href="/#waitlist">Waitlist</a>
              </li>
              <li>
                <a href="mailto:hello@roastmysite.example">Contact</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {YEAR} RoastMySite. All burns reserved.</span>
          <span>Feedback is honest. The fix is yours.</span>
        </div>
      </div>
    </footer>
  );
}