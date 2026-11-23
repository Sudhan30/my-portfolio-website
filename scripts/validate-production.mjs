import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';

const config=JSON.parse(await readFile('firebase.json','utf8'));
assert.deepEqual(Object.keys(config),['hosting']);
assert.equal(config.hosting.public,'build');
assert.equal(config.hosting.rewrites,undefined);assert.equal(config.hosting.predeploy,undefined);
const csp=config.hosting.headers.find(entry=>entry.source==='**').headers.find(header=>header.key==='Content-Security-Policy').value;
assert.match(csp,/connect-src 'none'/);assert.match(csp,/frame-ancestors 'none'/);assert.doesNotMatch(csp,/unsafe-inline|unsafe-eval/);
let js=0,css=0;
const files=await readdir('build',{recursive:true});
assert.ok(!files.some(path=>path.startsWith('design/') || /\.(pdf|docx)$/.test(path)));
for(const path of files.filter(path=>path.endsWith('.html'))) {
  const html=await readFile('build/'+path,'utf8');
  assert.doesNotMatch(html,/résumés?|resumes?|follow the evidence|draft for factual|local preview|cloudfunctions\.net|googletagmanager|google-analytics/i);
  assert.match(html,/rel="canonical" href="https:\/\/sudharsana\.dev\//);
  assert.match(html,/property="og:image" content="https:\/\/sudharsana\.dev\/social\.png"/);
  if(path!=='404.html')assert.match(html,/name="robots" content="index, follow"/);
  for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if(!match[2].trim())continue;
    assert.match(match[1],/application\/ld\+json/);
    const data=JSON.parse(match[2]);assert.equal(data.author.name,'Sudharsana Rajasekaran');
    assert.equal(data.author['@id'],'https://sudharsana.dev/#person');
    assert.ok(data.author.sameAs.includes('https://blog.sudharsana.dev/'));
    const app=data.author.subjectOf.find(item=>item['@type']==='SoftwareApplication');
    assert.equal(app.url,'https://babblescribe.com/');assert.equal(app.creator['@id'],data.author['@id']);
    assert.ok(csp.includes(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`));
  }
  for(const match of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)) {
    const target=match[1].split('#')[0];await readFile('build'+(target.endsWith('/')?target+'index.html':target));
  }
}
for(const path of files.filter(path=>/\.(js|css)$/.test(path))) {
  const bytes=await readFile('build/'+path);
  assert.doesNotMatch(bytes.toString(),/cloudfunctions\.net|googletagmanager|google-analytics|localStorage|sessionStorage|document\.cookie/);
  if(path.endsWith('.js'))js+=gzipSync(bytes).length;else css+=gzipSync(bytes).length;
}
assert.ok(js<=100000);assert.ok(css<=40000);
const social=await readFile('build/social.png');assert.equal(social.subarray(1,4).toString(),'PNG');
assert.equal(social.readUInt32BE(16),1200);assert.equal(social.readUInt32BE(20),630);
assert.equal(files.filter(path=>path.endsWith('.html')).length,9);
const sitemap=await readFile('build/sitemap.xml','utf8');
assert.equal(sitemap.match(/<loc>/g).length,8);assert.equal(sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g).length,8);
assert.match(await readFile('build/index.html','utf8'),/href="https:\/\/babblescribe\.com\/"/);
assert.deepEqual(config.hosting.redirects,[{source:'/work/text-to-sql',destination:'/work/ai-chat/',type:301},{source:'/work/text-to-sql/',destination:'/work/ai-chat/',type:301}]);
for(const line of (await readFile('release-artifact/files.sha256','utf8')).trim().split('\n')) {
  const [hash,path]=line.split('  ');assert.equal(createHash('sha256').update(await readFile(path)).digest('hex'),hash);
}
console.log(`Production checks passed: 8 public pages + 404; gzip JS ${js}B, CSS ${css}B; exact artifact verified.`);
