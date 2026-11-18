import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { chromium, firefox, webkit } from '../design-package/node_modules/@playwright/test/index.mjs';
import AxeBuilder from '../design-package/node_modules/@axe-core/playwright/dist/index.mjs';
import { checkPlayables } from '../design-package/scripts/playable-checks.mjs';

const base=process.env.PRODUCTION_TEST_URL ?? 'http://127.0.0.1:4322';
const routes=['/','/work/ai-chat/','/work/data-platform/','/work/argus/','/work/freshprobe/','/work/gtm-agents/','/work/customer-identity/','/work/affiliate-pipeline/'];
const result={timestamp:new Date().toISOString(),base,browsers:[]};
for(const [name,engine] of Object.entries({chromium,firefox,webkit})) {
  let browser;try{browser=await engine.launch();}catch(error){result.browsers.push({name,status:'unavailable',reason:error.message.slice(0,1200)});continue;}
  const item={name,status:'passed',layouts:0,axeScans:0,violations:[],externalRequests:[],pageErrors:[],checks:[]};
  try{
    const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();
    await page.addInitScript(()=>{window.__cspViolations=[];document.addEventListener('securitypolicyviolation',event=>window.__cspViolations.push(event.violatedDirective));});
    page.on('pageerror',error=>item.pageErrors.push(error.message));
    page.on('request',req=>{if(!req.url().startsWith(base))item.externalRequests.push(req.url());});
    for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:1000});
      for(const route of routes){
        const response=await page.goto(base+route);assert.equal(response.status(),200,route);
        await page.evaluate(()=>document.fonts.ready);
        if (route === '/' && width === 390) {
          assert.equal(await page.locator('h1').textContent(), 'Sudharsana Rajasekaran');
          const link = await page.locator('a[href="/work/customer-identity/"]').first().boundingBox();
          assert.ok(link && link.y >= 0 && link.y + link.height <= 844, 'Identity case visible on first phone screen');
        }
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),`${width} ${route}: overflow`);
        assert.equal(await page.locator('h1').count(),1);item.layouts++;
        assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://sudharsana.dev'+route);
        assert.deepEqual(await page.evaluate(()=>window.__cspViolations),[]);
        if(width===390 || width===1440){const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();item.axeScans++;item.violations.push(...axe.violations.map(v=>({route,width,id:v.id,impact:v.impact})));}
      }
    }
    await page.goto(base);await page.waitForFunction(()=>!!document.querySelector('[data-enhanced=true]'));
    await page.getByRole('radio',{name:'One request'}).focus();await page.keyboard.press('ArrowRight');
    assert.equal(await page.getByRole('radio',{name:'A busy queue'}).isChecked(),true);
    await page.keyboard.press('ArrowRight');assert.equal(await page.getByRole('radio',{name:'A shared prefix'}).isChecked(),true);
    assert.equal(await page.locator('.request-dot').evaluate(el=>el.getAnimations().length),0);
    assert.deepEqual(await page.evaluate(()=>window.__cspViolations),[]);
    item.checks.push('keyboard and reduced motion work under production CSP');
    for(const route of ['/does-not-exist/','/design/']){const response=await page.goto(base+route);assert.equal(response.status(),404);}
    item.checks.push('unknown and review routes return 404');
    assert.equal(item.externalRequests.length,0);assert.equal(item.pageErrors.length,0);
    assert.equal((await context.cookies()).length,0);await context.close();
    const animated=await browser.newContext({reducedMotion:'no-preference'});const p=await animated.newPage();
    await p.goto(base);await p.waitForFunction(()=>!!document.querySelector('[data-enhanced=true]'));
    await p.getByRole('radio',{name:'A busy queue'}).check();assert.ok(await p.locator('.request-dot').evaluate(el=>el.getAnimations().length)>0);
    await p.waitForTimeout(1200);assert.equal(await p.locator('.request-dot').evaluate(el=>el.getAnimations().length),0);
    item.checks.push('deliberate Motion animation plays once under production CSP');await animated.close();
    const plain=await browser.newContext({javaScriptEnabled:false});const nojs=await plain.newPage();
    await nojs.goto(base);assert.equal(await nojs.locator('.scenario-explanation:visible').count(),3);
    await nojs.getByRole('link',{name:'Explore the story'}).first().click();assert.equal(await nojs.getByRole('heading',{name:'A gate before the model speaks'}).isVisible(),true);
    item.checks.push('no-JavaScript explanations and work navigation');await plain.close();
    const playable=await checkPlayables(browser,base,routes,{cspViolations:true});assert.equal(playable.length,7);
    item.checks.push('playable figures on all seven stories under production CSP');
    assert.equal(item.violations.filter(v=>['critical','serious'].includes(v.impact)).length,0,JSON.stringify(item.violations));
  }catch(error){item.status='failed';item.error=error.stack;}
  finally{await browser.close();result.browsers.push(item);}
}
await writeFile('design-package/evidence/production-browser.json',JSON.stringify(result,null,2)+'\n');
for(const item of result.browsers)console.log(`${item.name}: ${item.status}; ${item.layouts??0} layouts; ${item.axeScans??0} axe scans${item.error?'\n'+item.error:''}`);
assert.equal(result.browsers.filter(b=>b.status==='failed').length,0);
assert.ok(result.browsers.find(b=>b.name==='chromium'&&b.status==='passed'));
assert.ok(result.browsers.find(b=>b.name==='firefox'&&b.status==='passed'));
