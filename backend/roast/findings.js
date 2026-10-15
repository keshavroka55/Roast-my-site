/**
 * backend/roast/findings.js — Turns metrics into roast findings.
 * Every finding carries raw evidence and a confidence flag.
 */
function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function makePicker(seed) {
  let cursor = seed;
  return (options) => {
    cursor = (cursor * 1103515245 + 12345) & 0x7fffffff;
    return options[cursor % options.length];
  };
}

const truncate = (v, max = 120) => (v.length > max ? `${v.slice(0, max - 1)}…` : v);

export function buildFindings(metrics, url) {
  const pick = makePicker(hashString(url.href));
  const findings = [];
  const push = (f) => findings.push(f);

  /* Content clarity */
  if (!metrics.title) {
    push({ id: 'title-missing', category: 'Content clarity', severity: 'cremated', confidence: 'measured',
      evidence: '<title> element not found in the served HTML.',
      observation: 'The document has no title element at all.',
      roast: pick(['No <title>. Bold move — you have made your page anonymous.',
        'Your page has no title. It is a website with no name and no shame.']),
      fix: 'Add a unique <title> of roughly 50–60 characters that names the page and the brand.' });
  } else if (metrics.title.length > 65) {
    push({ id: 'title-too-long', category: 'Content clarity', severity: 'charred', confidence: 'measured',
      evidence: `<title> is ${metrics.title.length} characters: "${truncate(metrics.title, 90)}"`,
      observation: 'The title is long enough that search results will cut it off.',
      roast: pick(['Your title is doing a monologue and the search results are already walking out.']),
      fix: 'Trim the title to about 60 characters, front-loading the page name and brand.' });
  } else if (metrics.title.length < 15) {
    push({ id: 'title-too-short', category: 'Content clarity', severity: 'toasted', confidence: 'measured',
      evidence: `<title> is only ${metrics.title.length} characters: "${metrics.title}"`,
      observation: 'The title is very short and carries little descriptive information.',
      roast: pick(['Your title says almost nothing. It is the textual equivalent of a shrug.']),
      fix: 'Expand the title to 50–60 characters so it communicates what the page actually offers.' });
  }

  if (!metrics.description) {
    push({ id: 'meta-description-missing', category: 'Content clarity', severity: 'charred', confidence: 'measured',
      evidence: 'No <meta name="description"> in the served HTML.',
      observation: 'There is no meta description, so search engines will invent one from page text.',
      roast: pick(['No meta description. Google will write your blurb for you, and Google is not funny.']),
      fix: 'Add a <meta name="description"> of roughly 150–160 characters.' });
  }

  if (metrics.h1Count === 0) {
    push({ id: 'h1-missing', category: 'Content clarity', severity: 'cremated', confidence: 'measured',
      evidence: `Scanned ${metrics.headings.length} heading element(s); zero were <h1>.`,
      observation: 'The page has no H1, so there is no single stated topic for the document.',
      roast: pick(['No H1. Your page has no thesis statement, just vibes and a nav bar.']),
      fix: 'Add exactly one <h1> that states what the page is about in plain language.' });
  } else if (metrics.h1Count > 1) {
    push({ id: 'h1-multiple', category: 'Content clarity', severity: 'toasted', confidence: 'measured',
      evidence: `Found ${metrics.h1Count} <h1> elements.`,
      observation: 'The page uses more than one H1, which flattens the document outline.',
      roast: pick([`${metrics.h1Count} H1s on one page. Everyone is the main character and nobody is.`]),
      fix: 'Keep one H1 for the page topic and demote the rest to <h2> or lower.' });
  }

  if (metrics.headingOrderBroken) {
    push({ id: 'heading-order', category: 'Content clarity', severity: 'toasted', confidence: 'measured',
      evidence: `Heading levels: ${metrics.headings.map((h) => `h${h.level}`).join(', ')}`,
      observation: 'Heading levels skip a step (for example h2 straight to h4) at some point.',
      roast: pick(['Your heading levels jump like a bad DJ. Screen readers are getting whiplash.']),
      fix: 'Nest headings in order without skipping levels.' });
  }

  if (metrics.wordCount > 0 && metrics.wordCount < 120) {
    push({ id: 'thin-content', category: 'Content clarity', severity: 'charred', confidence: 'measured',
      evidence: `Visible text after stripping script and style tags: ${metrics.wordCount} words.`,
      observation: 'The page carries very little readable text.',
      roast: pick([`${metrics.wordCount} words. That's not a landing page, that's a business card.`]),
      fix: 'Add substantive copy that answers: what is this, who is it for, and what do I do next.' });
  }

  /* Visual design */
  if (metrics.inlineStyles > 25) {
    push({ id: 'inline-styles', category: 'Visual design', severity: 'charred', confidence: 'measured',
      evidence: `Found ${metrics.inlineStyles} style="..." attributes in the served HTML.`,
      observation: 'Styling is applied inline at high volume rather than through stylesheets.',
      roast: pick([`${metrics.inlineStyles} inline styles. Your CSS did not run away — it was never invited.`]),
      fix: 'Move repeated inline declarations into a stylesheet or design tokens.' });
  }
  if (metrics.stylesheets > 6) {
    push({ id: 'stylesheet-count', category: 'Visual design', severity: 'toasted', confidence: 'measured',
      evidence: `Found ${metrics.stylesheets} <link rel="stylesheet"> tags.`,
      observation: 'The page loads a large number of separate stylesheets.',
      roast: pick([`${metrics.stylesheets} stylesheets. Your CSS has a family tree and everyone showed up.`]),
      fix: 'Bundle stylesheets and audit for unused rules.' });
  }
  if (metrics.importantCount > 15) {
    push({ id: 'important-abuse', category: 'Visual design', severity: 'charred', confidence: 'measured',
      evidence: `Found ${metrics.importantCount} occurrences of "!important" in the served HTML.`,
      observation: 'The cascade is being overridden by force at scale.',
      roast: pick([`${metrics.importantCount} uses of !important. That is not a stylesheet, that is a hostage negotiation.`]),
      fix: 'Remove !important overrides and fix the underlying specificity problem.' });
  }
  if (metrics.fontFamilies.length > 5) {
    push({ id: 'font-sprawl', category: 'Visual design', severity: 'charred', confidence: 'inferred',
      evidence: `Distinct font-family names: ${metrics.fontFamilies.slice(0, 8).join(', ')} (${metrics.fontFamilies.length} total).`,
      observation: 'Many distinct font families appear in the markup.',
      roast: pick([`${metrics.fontFamilies.length} font families. Your typography is a group chat with no admin.`]),
      fix: 'Standardise on one display face and one body face.' });
  }
  if (metrics.hexColors.length > 24) {
    push({ id: 'color-sprawl', category: 'Visual design', severity: 'toasted', confidence: 'inferred',
      evidence: `${metrics.hexColors.length} distinct 6-digit hex colours in the served source.`,
      observation: 'The source contains a large number of distinct colours.',
      roast: pick([`${metrics.hexColors.length} distinct hex colours. That is not a palette, that is a paint aisle explosion.`]),
      fix: 'Define a small palette of brand colours plus a neutral ramp.' });
  }

  /* Usability */
  if (!metrics.lang) {
    push({ id: 'lang-missing', category: 'Usability', severity: 'charred', confidence: 'measured',
      evidence: 'No lang attribute found on the <html> element.',
      observation: 'The document does not declare its language.',
      roast: pick(['No lang attribute. Screen readers are guessing your language, and they will guess wrong.']),
      fix: 'Add lang="en" (or the correct language code) to the <html> element.' });
  }
  if (!metrics.hasDoctype) {
    push({ id: 'doctype-missing', category: 'Usability', severity: 'toasted', confidence: 'measured',
      evidence: 'The document does not begin with <!doctype html>.',
      observation: 'The page is missing a doctype declaration.',
      roast: pick(['No doctype. You are asking browsers to interpret your page using their most confused personality.']),
      fix: 'Add <!doctype html> as the very first line of the document.' });
  }
  if (metrics.imagesMissingAlt > 0) {
    const ratio = metrics.imageCount > 0 ? metrics.imagesMissingAlt / metrics.imageCount : 0;
    push({ id: 'img-alt-missing', category: 'Usability', severity: ratio > 0.5 ? 'cremated' : 'charred',
      confidence: 'measured',
      evidence: `${metrics.imagesMissingAlt} of ${metrics.imageCount} <img> tags have no alt attribute.`,
      observation: 'Images are served without alternative text.',
      roast: pick([`${metrics.imagesMissingAlt} images with no alt text. Screen reader users are getting a gallery of silence.`]),
      fix: 'Add a descriptive alt attribute to every meaningful image.' });
  }
  if (metrics.labelableInputs > 0 && metrics.labelCount + metrics.ariaLabelCount === 0) {
    push({ id: 'inputs-unlabelled', category: 'Usability', severity: 'cremated', confidence: 'inferred',
      evidence: `${metrics.labelableInputs} input(s); ${metrics.labelCount} <label>; ${metrics.ariaLabelCount} aria-label.`,
      observation: 'The page contains form inputs but no label was found in the served HTML.',
      roast: pick(['You have form fields and no labels. Every one of them is a mystery box.']),
      fix: 'Associate every input with a <label> or an aria-label.' });
  }

  /* Navigation */
  if (metrics.genericAnchors.length >= 2) {
    push({ id: 'generic-link-text', category: 'Navigation', severity: 'toasted', confidence: 'measured',
      evidence: `${metrics.genericAnchors.length} links use generic text: ${metrics.genericAnchors.slice(0, 5).map((a) => `"${a.text}"`).join(', ')}`,
      observation: 'Multiple links use non-descriptive anchor text.',
      roast: pick([`${metrics.genericAnchors.length} links that just say "click here" or "read more". Nobody clicks "here". Here is nowhere.`]),
      fix: 'Rewrite anchor text so each link makes sense read out of context.' });
  }
  if (metrics.blankTargets > 0) {
    push({ id: 'unsafe-blank-targets', category: 'Navigation', severity: 'toasted', confidence: 'measured',
      evidence: `${metrics.blankTargets} link(s) use target="_blank" without rel="noopener".`,
      observation: 'Links that open in a new tab do not set rel="noopener".',
      roast: pick(['You open new tabs without rel="noopener". That is a small hole in your hull, but it is a hole.']),
      fix: 'Add rel="noopener noreferrer" to every target="_blank" link.' });
  }
  if (metrics.linkCount === 0 && metrics.wordCount > 50) {
    push({ id: 'no-links', category: 'Navigation', severity: 'charred', confidence: 'measured',
      evidence: `Found 0 <a> elements on a page with ${metrics.wordCount} words of text.`,
      observation: 'The page has no navigable links.',
      roast: pick(['A page with content and no links. It is a cul-de-sac with a nice view.']),
      fix: 'Add clear onward navigation.' });
  }

  /* Mobile */
  if (!metrics.viewport) {
    push({ id: 'viewport-missing', category: 'Mobile experience', severity: 'cremated', confidence: 'measured',
      evidence: 'No <meta name="viewport"> tag in the served HTML.',
      observation: 'The page does not declare a viewport.',
      roast: pick(['No viewport meta tag. On a phone, your site will render at desktop width.']),
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> inside <head>.' });
  } else if (!metrics.viewportHasWidthDevice) {
    push({ id: 'viewport-fixed-width', category: 'Mobile experience', severity: 'charred', confidence: 'measured',
      evidence: `Viewport tag found, but no width=device-width: ${truncate(metrics.viewport, 140)}`,
      observation: 'The viewport is declared but does not use device-width.',
      roast: pick(['Your viewport tag does not use device-width. It is a responsive design in name only.']),
      fix: 'Set width=device-width in the viewport meta tag.' });
  }

  return findings;
}