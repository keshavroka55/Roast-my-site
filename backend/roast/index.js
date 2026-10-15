/**
 * backend/roast/index.js — Orchestrates the full roast.
 */
import { normalizeUrl, fetchDocument } from './fetch.js';
import { analyzeHtml } from './analyze.js';
import { buildFindings } from './findings.js';
import { scoreFindings, verdictFor, summaryFor } from './score.js';

const NOT_MEASURED = [
  'We did not execute JavaScript or render the page in a browser, so client-rendered content is not reflected.',
  'We did not run Lighthouse or any performance audit. The fetch time and document size are raw server-side measurements.',
  'We did not take screenshots or evaluate anything visual about the rendered page.',
  'We did not check HTTPS configuration, redirect chains, DNS, uptime, or runtime accessibility.',
  'We did not inspect any page other than the URL you submitted.',
];

export async function roastUrl(input) {
  const url = normalizeUrl(input);
  const { html, bytes, fetchMs, status, finalUrl } = await fetchDocument(url);
  const metrics = analyzeHtml(html);
  const findings = buildFindings(metrics, url);
  const score = scoreFindings(findings);

  return {
    url: url.href,
    finalUrl,
    hostname: new URL(finalUrl).hostname,
    fetchedAt: new Date().toISOString(),
    status,
    score,
    verdict: verdictFor(score),
    summary: summaryFor(score, findings.length),
    findings,
    stats: {
      htmlBytes: bytes,
      fetchMs,
      wordCount: metrics.wordCount,
      imageCount: metrics.imageCount,
      linkCount: metrics.linkCount,
      scriptCount: metrics.scripts,
      stylesheetCount: metrics.stylesheets,
    },
    notMeasured: NOT_MEASURED,
  };
}

export { HttpError } from '../lib/http.js';