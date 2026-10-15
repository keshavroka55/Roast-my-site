/**
 * backend/lib/jsonStore.js — Atomic JSON file store for data/data.json.
 *
 * One file, one writer. Every write goes through a serialised queue so two
 * concurrent updates cannot corrupt the file or clobber each other.
 *
 * Interface:
 *   read()              → { waitlist: [...], roasts: [...] }
 *   update(mutator)     → applies mutator(data) and persists; returns new data
 *
 * Swap this file for a Postgres client exposing the same interface when the
 * file becomes a bottleneck. Callers do not change.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const TMP_FILE = `${DATA_FILE}.tmp`;

const EMPTY = { waitlist: [], roasts: [] };

let cache = null;
let chain = Promise.resolve();

async function loadFromDisk() {
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      waitlist: Array.isArray(parsed.waitlist) ? parsed.walklist ?? parsed.waitlist : [],
      roasts: Array.isArray(parsed.roasts) ? parsed.roasts : [],
    };
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('[jsonStore] could not read data.json, starting empty:', err.message);
    }
    return structuredClone(EMPTY);
  }
}

async function persist(data) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(TMP_FILE, JSON.stringify(data, null, 2), 'utf8');
  await rename(TMP_FILE, DATA_FILE); // atomic swap
}

export async function read() {
  if (!cache) cache = await loadFromDisk();
  return cache;
}

export function update(mutator) {
  const run = chain.then(async () => {
    const data = await read();
    const next = (await mutator(data)) ?? data;
    cache = next;
    await persist(next);
    return next;
  });

  chain = run.then(
    () => undefined,
    () => undefined,
  );

  return run;
}

export function reset() {
  cache = null;
}