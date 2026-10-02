import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve(process.env.SITE_ROOT ?? 'dist');
const port = Number(process.env.DESIGN_PORT ?? 4321);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.webp':'image/webp', '.woff2':'font/woff2', '.txt':'text/plain; charset=utf-8' };
createServer(async (req,res) => {
  res.setHeader('X-Robots-Tag','noindex, nofollow');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  const hostingConfig = process.env.SITE_ROOT ? JSON.parse(await readFile('firebase.json','utf8')) : undefined;
  const productionCSP = hostingConfig?.hosting.headers.find(entry=>entry.source==='**')?.headers.find(header=>header.key==='Content-Security-Policy')?.value;
  res.setHeader('Content-Security-Policy', productionCSP ?? "default-src 'none'; script-src 'self'; style-src 'self'; style-src-attr 'unsafe-inline'; font-src 'self'; img-src 'self'; connect-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
  res.setHeader('Cache-Control','no-store');
  try {
    const pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${port}`).pathname);
    const file = resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
    if (!file.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
    let body;
    try { body = await readFile(file); }
    catch { body = await readFile(resolve(root,'404.html')); res.statusCode=404; }
    res.setHeader('Content-Type',res.statusCode === 404 ? types['.html'] : (types[extname(file)] ?? 'application/octet-stream'));
    if(req.method !== 'GET' && req.method !== 'HEAD') {res.statusCode=405;res.end();return;}
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(400);res.end('Bad request'); }
}).listen(port,'127.0.0.1',()=>process.stdout.write(`Design package: http://127.0.0.1:${port}/design/\n`));
