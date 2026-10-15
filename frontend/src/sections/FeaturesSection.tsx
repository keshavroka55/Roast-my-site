const CATEGORIES = [
  {
    name: 'Content clarity',
    body: 'Title tags, meta descriptions, heading order, reading level, and whether your H1 actually says anything.',
  },
  {
    name: 'Visual design',
    body: 'Inline style count, stylesheet weight, font family sprawl, distinct colour count, and !important abuse.',
  },
  {
    name: 'Usability',
    body: 'Form labelling, language declaration, doctype, document size, and whether anything is labelled at all.',
  },
  {
    name: 'Navigation',
    body: 'Link text quality, generic anchors, external link safety, and how many ways out of the page you left.',
  },
  {
    name: 'Mobile experience',
    body: 'Viewport meta tag, fixed-width hints, and touch-target signals visible in the markup.',
  },
  {
    name: 'Honesty',
    body: 'Every finding is tagged Measured or Inferred, so you always know what we actually looked at.',
  },
];

export function FeaturesSection() {
  return (
    <section className="section" id="what-we-check">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">What we check</p>
          <h2 className="display-lg">Five categories. One score. Zero mercy.</h2>
          <p className="lede">
            We only complain about things we can point at in your HTML. If we can't cite it, we
            don't say it.
          </p>
        </div>

        <div className="category-grid">
          {CATEGORIES.map((category) => (
            <div className="category" key={category.name}>
              <h3 className="category__name">{category.name}</h3>
              <p className="category__body">{category.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}