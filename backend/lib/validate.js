import { HttpError } from './http.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function requireEmail(input) {
  const value = String(input ?? '').trim();
  if (!value) throw new HttpError(400, 'Enter an email address.');
  if (value.length > 254) throw new HttpError(400, 'That email address is too long.');
  if (!EMAIL_RE.test(value)) throw new HttpError(400, 'That does not look like a valid email address.');
  return value.toLowerCase();
}

export function requireString(input, label, { max = 2048, min = 1 } = {}) {
  const value = String(input ?? '').trim();
  if (value.length < min) throw new HttpError(400, `${label} is required.`);
  if (value.length > max) throw new HttpError(400, `${label} is too long.`);
  return value;
}

export function optionalString(input, { max = 2048 } = {}) {
  const value = String(input ?? '').trim();
  if (!value) return '';
  if (value.length > max) throw new HttpError(400, 'Value is too long.');
  return value;
}