import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const root = resolve('dist');
const routes = (await readdir(root,{recursive:true})).filter(path => path.endsWith('.html')).sort();
const results = { routes: [], assets: [], gzipJSBytes:0, gzipCSSBytes:0, externalResources: [] };
for(const license of ['licenses/space-grotesk-OFL.txt','licenses/instrument-serif-OFL.txt']) assert.match(await readFile(resolve(root,license),'utf8'),/SIL OPEN FONT LICENSE/i);
for(const route of routes) {
  const html = await readFile(resolve(root,route),'utf8');
  assert.match(html, /<html lang="en">/);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.equal((html.match(/<h1[ >]/g) ?? []).length,1,route);
  assert.doesNotMatch(html, /<script(?![^>]*src=)[^>]*>[\s\S]*?\S[\s\S]*?<\/script>/,`Inline script in ${route}`);
  assert.doesNotMatch(html, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,`Private email in ${route}`);
  assert.doesNotMatch(html, /(?:\+1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}|\/home\/[^/]+\//,`Private phone or local path in ${route}`);
  for(const match of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g)) {
    const path = match[1].split('#')[0];
    await readFile(resolve(root,'.' + (path.endsWith('/') ? path+'index.html' : path)));
  }
  for(const match of html.matchAll(/(?:src|srcset)="(https?:[^" ]+)/g)) results.externalResources.push(match[1]);
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length,`Duplicate ids in ${route}`);
  results.routes.push(route);
}
assert.equal(results.externalResources.length,0);
assert.ok(!(await readdir(root,{recursive:true})).some(path => /\.(pdf|docx)$|(?:^|\/)\.env/.test(path)),'Unexpected private document in artifact');
for(const path of await readdir(root,{recursive:true})) {
  if(!/\.(js|css|webp|woff2|svg)$/.test(path)) continue;
  const bytes = await readFile(resolve(root,path));
  if(path.endsWith('.webp')) {
    for(let offset=12;offset+8<=bytes.length;) {
      const chunk=bytes.toString('ascii',offset,offset+4);
      assert.ok(!['EXIF','XMP ','ICCP'].includes(chunk),`${path}: unexpected image metadata ${chunk}`);
      const length=bytes.readUInt32LE(offset+4);offset+=8+length+(length%2);
    }
  }
  if(path.endsWith('.svg')) assert.doesNotMatch(bytes.toString(),/<script|<foreignObject|(?:href|src)=["']https?:/i);
  const gzipBytes = gzipSync(bytes).length;
  if(path.endsWith('.js')) results.gzipJSBytes+=gzipBytes;
  if(path.endsWith('.css')) results.gzipCSSBytes+=gzipBytes;
  if(/\.(js|css)$/.test(path)) assert.doesNotMatch(bytes.toString(),/cloudfunctions\.net|googletagmanager|google-analytics|firebaseapp\.com|localStorage|sessionStorage|document\.cookie/);
  results.assets.push({path,bytes:bytes.length,gzipBytes,sha256:createHash('sha256').update(bytes).digest('hex')});
}
assert.ok(results.gzipJSBytes<=100_000);
assert.ok(results.gzipCSSBytes<=40_000);
await writeFile('evidence/artifact-checks.json',JSON.stringify(results,null,2)+'\n');
const manifest=[];
for(const path of (await readdir(root,{recursive:true})).sort()) {
  let bytes;try{bytes=await readFile(resolve(root,path));}catch(error){if(error.code==='EISDIR')continue;throw error;}
  manifest.push(`${createHash('sha256').update(bytes).digest('hex')}  ${path}`);
}
await writeFile('evidence/artifact.sha256',manifest.join('\n')+'\n');
console.log(`${results.routes.length} routes; local resources only; gzip JS ${results.gzipJSBytes}B, CSS ${results.gzipCSSBytes}B.`);
