import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, resolve, relative, isAbsolute } from 'node:path';

const root = await realpath(dirname(fileURLToPath(import.meta.url)));
const port = Number(process.env.PORT || process.argv[2] || 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Use a port between 1 and 65535.');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream',
  '.wasm': 'application/wasm', '.woff2': 'font/woff2', '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8',
};
function isOutside(path) {
  const rel = relative(root, path);
  return rel === '..' || rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) || isAbsolute(rel);
}
function fail(response, status, message) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
  response.end(message);
}
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.setHeader('Allow', 'GET, HEAD');
    return fail(response, 405, 'Method not allowed.');
  }
  let path;
  try { path = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname); }
  catch { return fail(response, 400, 'Invalid URL.'); }
  const segments = path.split('/');
  if (path.includes('\\') || path.includes('\0') || segments.some((part) => part.startsWith('.'))) {
    return fail(response, 403, 'Access denied.');
  }
  try {
    let file = resolve(root, `.${path}`);
    if (isOutside(file)) return fail(response, 403, 'Access denied.');
    let details = await stat(file);
    if (details.isDirectory()) {
      file = resolve(file, 'index.html');
      details = await stat(file);
    }
    file = await realpath(file);
    if (isOutside(file) || !details.isFile()) return fail(response, 403, 'Access denied.');
    const headers = {
      'Content-Type': types[extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': details.size,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
      'Accept-Ranges': 'bytes',
    };
    let start = 0;
    let end = details.size - 1;
    let status = 200;
    if (request.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
      if (!match || (!match[1] && !match[2])) {
        response.setHeader('Content-Range', `bytes */${details.size}`);
        return fail(response, 416, 'Invalid byte range.');
      }
      if (!match[1]) start = Math.max(0, details.size - Number(match[2]));
      else {
        start = Number(match[1]);
        if (match[2]) end = Math.min(Number(match[2]), end);
      }
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= details.size) {
        response.setHeader('Content-Range', `bytes */${details.size}`);
        return fail(response, 416, 'Unsatisfiable byte range.');
      }
      status = 206;
      headers['Content-Range'] = `bytes ${start}-${end}/${details.size}`;
      headers['Content-Length'] = end - start + 1;
    }
    response.writeHead(status, headers);
    if (request.method === 'HEAD' || details.size === 0) return response.end();
    const stream = createReadStream(file, { start, end });
    stream.on('error', () => response.destroy());
    stream.pipe(response);
  } catch (error) {
    fail(response, error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 500, 'File unavailable.');
  }
});
server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Choose another: node serve.mjs 4174` : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Anatomy Studio: http://127.0.0.1:${port}`);
  console.log('Local preview only. Deploy to HTTPS for access from a phone on another network.');
});
