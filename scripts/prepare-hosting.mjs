import { readFile, readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

await rm('build/design',{recursive:true,force:true});
const pages=(await readdir('build',{recursive:true})).filter(path=>path.endsWith('.html')).sort();
const hashes=new Set();
for(const path of pages) {
  const html=await readFile('build/'+path,'utf8');
  for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
    if(match[1].trim()) hashes.add(`'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`);
  }
}
const csp=`default-src 'none'; script-src 'self' ${[...hashes].join(' ')}; style-src 'self'; style-src-attr 'none'; font-src 'self'; img-src 'self'; connect-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'; object-src 'none'`;
const htmlCache={key:'Cache-Control',value:'public, max-age=0, must-revalidate'};
// The text-to-SQL experiment became a tool inside the chat agent; keep its old URL working.
const redirects=['/work/text-to-sql','/work/text-to-sql/'].map(source=>({source,destination:'/work/ai-chat/',type:301}));
const config={hosting:{public:'build',ignore:['firebase.json','**/.*','**/node_modules/**'],trailingSlash:true,cleanUrls:false,redirects,headers:[
  {source:'**',headers:[{key:'Content-Security-Policy',value:csp},{key:'X-Content-Type-Options',value:'nosniff'},{key:'X-Frame-Options',value:'DENY'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'}]},
  ...['/','/index.html','/work/**','/404.html','/robots.txt','/sitemap.xml','/favicon.svg','/social.png','/licenses/**'].map(source=>({source,headers:[htmlCache]})),
  {source:'/_astro/**',headers:[{key:'Cache-Control',value:'public, max-age=31536000, immutable'}]},
]}};
await writeFile('firebase.json',JSON.stringify(config,null,2)+'\n');
const urls=pages.filter(path=>path!=='404.html').map(path=>'https://sudharsana.dev/'+(path==='index.html'?'':path.replace(/index\.html$/,'')));
await writeFile('build/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>`<url><loc>${url}</loc></url>`).join('')+'</urlset>\n');
await writeFile('build/robots.txt','User-agent: *\nAllow: /\nSitemap: https://sudharsana.dev/sitemap.xml\n');
const manifest=[];
for(const path of (await readdir('build',{recursive:true})).sort()) {
  let bytes;try{bytes=await readFile('build/'+path);}catch(error){if(error.code==='EISDIR')continue;throw error;}
  manifest.push(`${createHash('sha256').update(bytes).digest('hex')}  build/${path}`);
}
manifest.push(`${createHash('sha256').update(await readFile('firebase.json')).digest('hex')}  firebase.json`);
await mkdir('release-artifact',{recursive:true});
await writeFile('release-artifact/files.sha256',manifest.join('\n')+'\n');
await writeFile('release-artifact/provenance.json',JSON.stringify({commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),canonical:'https://sudharsana.dev',routes:urls,files:manifest.length},null,2)+'\n');
console.log(`Prepared ${urls.length} public pages; ${hashes.size} structured-data hashes; no application API or review routes.`);
