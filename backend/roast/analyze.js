/**
 * backend/roast/analyze.js — Dependency-free HTML extraction.
 */
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘',
  ldquo: '“', rdquo: '”',
};

function decodeEntities(input) {
  return input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match);
}

function toText(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function countMatches(h, re) {
  return (h.match(re) ?? []).length;
}

export function analyzeHtml(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? toText(titleMatch[1]) : '';

  const descMatch =
    html.match(/<meta[^>]+name\s*=\s*["']description["'][^>]*content\s*=\s*["']([^"']*)["']/i) ??
    html.match(/<meta[^>]+content\s*=\s*["']([^"']*)["'][^>]*name\s*=\s*["']description["']/i);
  const description = descMatch ? decodeEntities(descMatch[1]).trim() : '';

  const viewportMatch = html.match(/<meta[^>]+name\s*=\s*["']viewport["'][^>]*>/i);
  const viewport = viewportMatch ? viewportMatch[0] : '';
  const viewportHasWidthDevice = /width\s*=\s*device-width/i.test(viewport);

  const langMatch = html.match(/<html[^>]*\slang\s*=\s*["']([^"']+)["']/i);
  const lang = langMatch ? langMatch[1].trim() : '';
  const hasDoctype = /^\s*<!doctype\s+html/i.test(html);

  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: toText(m[2]),
  }));
  const h1s = headings.filter((h) => h.level === 1);

  const images = html.match(/<img\b[^>]*>/gi) ?? [];
  const imagesMissingAlt = images.filter(
    (tag) => !/\balt\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i.test(tag),
  ).length;
  const imagesEmptyAlt = images.filter((tag) => /\balt\s*=\s*(""|''|"\s*"|'\s*')/i.test(tag)).length;

  const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((m) => ({
    attrs: m[1],
    text: toText(m[2]),
  }));
  const GENERIC = /^(click here|here|read more|more|learn more|this|link|info|details|go)$/i;
  const genericAnchors = anchors.filter((a) => GENERIC.test(a.text));
  const blankTargets = anchors.filter(
    (a) => /target\s*=\s*["']?_blank/i.test(a.attrs) && !/rel\s*=\s*["'][^"']*noopener/i.test(a.attrs),
  ).length;

  const inputTags = html.match(/<input\b[^>]*>/gi) ?? [];
  const labelableInputs = inputTags.filter(
    (tag) => !/type\s*=\s*["']?(hidden|submit|button|reset|image)/i.test(tag),
  ).length;
  const labelCount = countMatches(html, /<label\b/gi);
  const ariaLabelCount = countMatches(html, /aria-label\s*=/gi);

  const inlineStyles = countMatches(html, /\sstyle\s*=\s*["']/gi);
  const stylesheets = countMatches(html, /<link\b[^>]*rel\s*=\s*["']?stylesheet/gi);
  const scripts = countMatches(html, /<script\b[^>]*\bsrc\s*=/gi);
  const importantCount = countMatches(html, /!\s*important/gi);

  const fontDeclarations = [...html.matchAll(/font-family\s*:\s*([^;"'}]+)/gi)].map((m) => m[1]);
  const fontFamilies = [
    ...new Set(
      fontDeclarations
        .flatMap((v) => v.split(','))
        .map((n) => n.trim().replace(/^["']|["']$/g, '').toLowerCase())
        .filter((n) => n && !n.startsWith('var(') && n.length < 48),
    ),
  ];

  const hexColors = [...new Set((html.match(/#[0-9a-f]{6}\b/gi) ?? []).map((h) => h.toLowerCase()))];

  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  const wordCount = decodeEntities(visibleText).split(/\s+/).filter(Boolean).length;

  let headingOrderBroken = false;
  let prevLevel = 0;
  for (const h of headings) {
    if (prevLevel > 0 && h.level > prevLevel + 1) {
      headingOrderBroken = true;
      break;
    }
    prevLevel = h.level;
  }

  return {
    title, description, viewport, viewportHasWidthDevice, lang, hasDoctype,
    headings, h1Count: h1s.length, h1Text: h1s[0]?.text ?? '',
    imageCount: images.length, imagesMissingAlt, imagesEmptyAlt,
    linkCount: anchors.length, genericAnchors, blankTargets,
    labelableInputs, labelCount, ariaLabelCount,
    inlineStyles, stylesheets, scripts, importantCount,
    fontFamilies, hexColors, wordCount, headingOrderBroken,
  };
}

export { decodeEntities, toText };