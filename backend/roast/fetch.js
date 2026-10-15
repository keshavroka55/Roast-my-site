/**
 * backend/roast/fetch.js — URL validation, SSRF guard, and HTML fetch.
 */
import { lookup } from 'node:dns/promises';
import { HttpError } from '../lib/http.js';
import { isIP } from 'node:net';

const FETCH_TIMEOUT_MS = 12_000;
const MAX_BYTES = 3_000_000;
const USER_AGENT =
  'RoastMySiteBot/0.1 (+https://roastmysite.example/bot; reads HTML only, no JS execution)';

const BLOCKED_HOST_SUFFIXES = ['.local', '.internal', '.localhost'];
const ALLOW_PRIVATE = process.env.ALLOW_PRIVATE_ROAST === 'true';
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

function isLoopbackHost(h) {
  return LOOPBACK_HOSTS.has(h.toLowerCase());
}

export function isPrivateIp(ip) {
  if (ip.includes(':')) {
    const v = ip.toLowerCase();
    return (
      v === '::1' ||
      v === '::' ||
      v.startsWith('fc') ||
      v.startsWith('fd') ||
      v.startsWith('fe80') ||
      v.startsWith('::ffff:127.') ||
      v.startsWith('::ffff:10.') ||
      v.startsWith('::ffff:192.168.') ||
      v.startsWith('::ffff:172.')
    );
  }
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    a >= 224
  );
}

export function normalizeUrl(input) {
  let value = String(input ?? '').trim();
  if (!value) throw new HttpError(400, 'Paste a URL first.');
  if (value.length > 2048) throw new HttpError(400, 'That URL is unreasonably long.');

  // Fix "https:example.com" (missing //) → "https://example.com"
  value = value.replace(/^(https?):(?!\/\/)/i, '$1://');

  // Prepend https:// if no scheme at all.
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new HttpError(400, "That doesn't parse as a URL. Try something like example.com.");
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new HttpError(400, 'Only http and https URLs can be roasted.');
  }

  const host = parsed.hostname.toLowerCase();

  // Dev bypass: loopback hostnames allowed when ALLOW_PRIVATE_ROAST=true.
  if (ALLOW_PRIVATE && isLoopbackHost(host)) {
    parsed.hash = '';
    return parsed;
  }

  // Only run the IP range check when the host is a literal IP address.
  // Domain names are checked AFTER DNS resolution in assertPublicHost.
  if (isIP(host) !== 0 && isPrivateIp(host)) {
    throw new HttpError(400, "We can't roast local or private addresses.");
  }

  // Blocked hostname suffixes (mDNS, internal DNS conventions).
  if (
    host === 'localhost' ||
    BLOCKED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))
  ) {
    throw new HttpError(400, "We can't roast local or private addresses.");
  }

  parsed.hash = '';
  return parsed;
}

async function assertPublicHost(hostname) {
  if (ALLOW_PRIVATE && isLoopbackHost(hostname)) return;

  let records;
  try {
    records = await lookup(hostname, { all: true });
  } catch {
    throw new HttpError(400, `We couldn't resolve ${hostname}. Check the spelling.`);
  }
  if (records.length === 0) throw new HttpError(400, `We couldn't resolve ${hostname}.`);
  if (records.some((r) => isPrivateIp(r.address))) {
    throw new HttpError(400, 'That hostname resolves to a private address. Nice try.');
  }
}

export async function fetchDocument(url) {
  await assertPublicHost(url.hostname);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const started = performance.now();

  let response;
  try {
    response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml' },
    });
  } catch (err) {
    clearTimeout(timer);
    if (err?.name === 'AbortError') {
      throw new HttpError(504, 'That site took too long to respond.');
    }
    throw new HttpError(502, "We couldn't reach that site. Check the URL and try again.");
  }

  try {
    if (!response.ok) {
      throw new HttpError(502, `That site responded with HTTP ${response.status}.`);
    }
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('html') && !contentType.includes('xml')) {
      throw new HttpError(415, `That URL returned "${contentType || 'unknown'}", not HTML.`);
    }
    const buffer = await response.arrayBuffer();
    const fetchMs = Math.round(performance.now() - started);
    if (buffer.byteLength > MAX_BYTES) {
      throw new HttpError(413, `That page is ${(buffer.byteLength / 1_048_576).toFixed(1)} MB of HTML.`);
    }
    return {
      html: new TextDecoder('utf-8').decode(buffer),
      bytes: buffer.byteLength,
      fetchMs,
      status: response.status,
      finalUrl: response.url || url.href,
    };
  } finally {
    clearTimeout(timer);
  }
}