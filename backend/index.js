import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApi } from './api.js';
import { applyCors } from './lib/cors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FRONTEND_DIST = path.join(ROOT, 'frontend', 'dist');
const ADMIN_DIST = path.join(ROOT, 'admin', 'dist');
const PORT = Number(process.env.PORT ?? 4000);

const ENV_PATH = path.join(__dirname, '..', '.env');
// just checking that the .env is loaded or not. 

if (existsSync(ENV_PATH)) {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(ENV_PATH);
    console.log(`[env] loaded ${ENV_PATH}`);
  } else {
    console.warn('[env] process.loadEnvFile is not available. Requires Node 20.12+.');
  }
} else {
  console.warn(`[env] no .env file at ${ENV_PATH} — mail and other secrets will be missing.`);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

async function serveSpa(distDir, req, res, basePath = '') {
  const url = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);

  // Strip the mount path (/admin) from the SPA route.
  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length) || '/';
  }

  if (pathname.includes('\0')) {
    res.statusCode = 400;
    return res.end('Bad request');
  }

  let filePath = path.join(distDir, pathname);

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = path.join(filePath, 'index.html');
  } catch {
    filePath = path.join(distDir, 'index.html');
  }

  if (!filePath.startsWith(distDir)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  try {
    await stat(filePath);
  } catch {
    res.statusCode = 404;
    return res.end('Not found');
  }

  const ext = path.extname(filePath).toLowerCase();
  res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream');
  res.setHeader('Cache-Control', ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable');

  if (req.method === 'HEAD') {
    res.statusCode = 200;
    return res.end();
  }
  createReadStream(filePath).pipe(res);
}

const server = createServer(async (req, res) => {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.url && req.url.startsWith('/api/')) {
    return handleApi(req, res, () => {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'Not found.' }));
    });
  }

  // Admin SPA under /admin
  if (req.url && req.url.startsWith('/admin')) {
    try {
      await readFile(path.join(ADMIN_DIST, 'index.html'));
      return serveSpa(ADMIN_DIST, req, res, '/admin');
    } catch {
      res.statusCode = 503;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end('Admin build missing. Run `npm -w admin run build` first.\n');
    }
  }

  // Public SPA
  try {
    await readFile(path.join(FRONTEND_DIST, 'index.html'));
  } catch {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end(
      'RoastMySite: frontend build missing.\n' +
        'Run `npm -w frontend run build` first, or use `npm run dev` for development.\n',
    );
  }
  return serveSpa(FRONTEND_DIST, req, res);
});

server.listen(PORT, () => {
  console.log(`🔥 RoastMySite API on http://localhost:${PORT}`);
});