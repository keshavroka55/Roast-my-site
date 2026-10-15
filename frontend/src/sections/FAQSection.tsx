const FAQS = [
  {
    q: 'Is this automated, or is a real person reading my website?',
    a: 'A real person reviews it. We read the page and give feedback based on what we can actually observe in the design, content, and structure. The goal is clear human critique, not a generic machine verdict.',
  },
  {
    q: 'Why are some notes more opinion-based than others?',
    a: 'Some issues are objective — weak hierarchy, unclear messaging, poor labels, broken structure. Others are judgment calls about tone, clarity, or emphasis. We mark the difference clearly so you can tell what is factual and what is editorial.',
  },
  {
    q: 'Do you run Lighthouse or render the page in a browser?',
    a: 'No. This is not a script-based audit. We are not running automated scanners or browser tooling. We review the page as a person would, based on the actual content and structure you send in.',
  },
  {
    q: 'Is my URL stored?',
    a: 'We use the URL to review the page and keep your email only as long as needed to contact you about the review. We do not build a profile of the sites you submit.',
  },
  {
    q: 'Can I submit a site that is not mine?',
    a: 'Yes. If it is public, you can send it in. The feedback is still useful — it is just someone else’s website receiving the burn.',
  },
  {
    q: 'What does the score mean?',
    a: 'It is a simple summary of how strong the page feels overall. It is not a universal quality metric and not a machine-generated diagnosis. It is just an easy way to frame the feedback.',
  },
];

export function FAQSection() {
  return (
    <section className="section band--alt" id="faq">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2 className="display-lg">Questions before the review.</h2>
        </div>

        <div className="faq">
          {FAQS.map((item) => (
            <details className="faq__item" key={item.q}>
              <summary>{item.q}</summary>
              <p className="faq__answer">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}