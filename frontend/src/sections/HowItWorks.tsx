const STEPS = [
  {
    title: 'Share your email + URL',
    body: 'Send the page you want reviewed. No account setup, no weird dashboard, just the site and the contact details we need.',
  },
  {
    title: 'A real person checks it',
    body: 'We manually review the page structure, messaging, and usability signals. No AI verdicts. No browser automation. Just a human reading it properly.',
  },
  {
    title: 'You get useful feedback',
    body: 'You receive specific notes, weak points, and practical fixes — written like a human reviewer, not a generic score generator.',
  },
];

export function HowItWorks() {
  return (
    <section className="section band--alt" id="how-it-works">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">How it works</p>
          <h2 className="display-lg">Three steps. Real feedback.</h2>
        </div>
        <ol className="steps">
          {STEPS.map((step, index) => (
            <li className="step" key={step.title}>
              <span className="step__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}