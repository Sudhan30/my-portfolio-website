import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { chromium, firefox, webkit } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = 'http://127.0.0.1:4321';
const routes = ['/', '/work/ai-chat/', '/design/', '/design/states/one/', '/design/states/queue/', '/design/states/prefix/', '/404.html'];
const widths = [320,390,768,1440];
const report = { timestamp: new Date().toISOString(), browsers:[], failures:[], screenshots:[] };
async function checkOverflow(page, label) {
  const size = await page.evaluate(() => ({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
  assert.ok(size.scroll<=size.client+1,`${label}: overflow ${JSON.stringify(size)}`);
}

for(const [name,engine] of Object.entries({chromium,firefox,webkit})) {
  let browser;
  try { browser = await engine.launch(); }
  catch(error) {report.browsers.push({name,status:'unavailable',reason:error.message.split('\n').filter(Boolean).slice(0,8).join('\n')});continue;}
  const result = {name,version:browser.version(),status:'passed',layouts:[],accessibility:[],checks:[],externalRequests:[],consoleErrors:[]};
  try {
    const context = await browser.newContext({reducedMotion:'reduce'});
    const page = await context.newPage();
    page.on('request',req=>{if(!req.url().startsWith(base)) result.externalRequests.push(req.url());});
    page.on('pageerror',error=>result.consoleErrors.push(error.message));
    page.on('console',msg=>{if(msg.type()==='error') result.consoleErrors.push(msg.text());});
    for(const width of widths) {
      await page.setViewportSize({width,height:1000});
      for(const route of routes) {
        const response = await page.goto(base+route);
        assert.equal(response.status(),200,route);
        assert.equal(response.headers()['x-robots-tag'],'noindex, nofollow');
        await page.evaluate(()=>document.fonts.ready);
        await checkOverflow(page,`${name} ${width}px ${route}`);
        assert.equal(await page.locator('h1').count(),1);
        result.layouts.push({width,route,overflow:false});
        if(width===390 || width===1440) {
          const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
          const violations=axe.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}));
          result.accessibility.push({width,route,violations});
          assert.equal(violations.filter(v=>['serious','critical'].includes(v.impact)).length,0,`${name} ${route} serious axe violations: ${JSON.stringify(violations)}`);
        }
        if(name==='chromium' && (width===390 || width===1440) && ['/', '/work/ai-chat/', '/design/'].includes(route)) {
          const filename = `evidence/${route==='/'?'homepage':route==='/design/'?'design-system':'work-story'}-${width===390?'mobile':'desktop'}.png`;
          await page.screenshot({path:filename,fullPage:true});report.screenshots.push(filename);
        }
      }
    }
    await page.setViewportSize({width:1440,height:1000});
    await page.goto(base);
    const one=page.getByRole('radio',{name:'One request'});
    await one.focus();await page.keyboard.press('ArrowRight');
    assert.equal(await page.getByRole('radio',{name:'A busy queue'}).isChecked(),true);
    assert.equal(await page.getByRole('heading',{name:'Share the work, watch the wait'}).isVisible(),true);
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.getByRole('radio',{name:'A shared prefix'}).isChecked(),true);
    assert.equal(await page.getByRole('heading',{name:'Reuse the beginning, compute what comes next'}).isVisible(),true);
    assert.equal(await page.locator('.request-dot').evaluate(el=>el.getAnimations().length),0);
    result.checks.push('native radio arrow-key navigation and immediate reduced motion');
    const firstLink=page.locator('.skip-link');
    await firstLink.focus();await firstLink.press('Enter');
    assert.equal(new URL(page.url()).hash,'#main');
    result.checks.push('skip link');
    assert.equal(await page.locator('a[href="https://www.linkedin.com/in/sudharsanarajasekaran/"]').count(),1);
    await page.locator('a[href="/work/ai-chat/"]').first().click();
    await page.waitForURL(base+'/work/ai-chat/');
    await page.getByRole('link',{name:'Back to selected work'}).click();
    await page.waitForURL(base+'/#work');
    result.checks.push('work story and back navigation; exact LinkedIn href');
    await page.evaluate(()=>{document.documentElement.style.zoom='2';});
    await checkOverflow(page,`${name} 200% CSS zoom`);
    assert.equal(await page.getByRole('heading',{name:'Selected work.'}).isVisible(),true);
    result.checks.push('200% CSS zoom overflow check (manual browser zoom still required)');
    await page.evaluate(()=>{document.documentElement.style.zoom='';});
    const missing=await page.goto(base+'/no-such-page/');assert.equal(missing.status(),404);
    assert.equal(await page.getByRole('heading',{name:'Nothing here. Plenty to explore.'}).isVisible(),true);
    result.checks.push('genuine unknown-route 404');
    assert.equal((await context.cookies()).length,0);
    await page.goto(base);
    assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
    assert.equal(result.externalRequests.length,0);
    assert.equal(result.consoleErrors.filter(e=>!e.includes('404')).length,0);
    result.checks.push('no external requests, cookies, or browser storage');
    await context.close();

    const fresh=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
    const freshPage=await fresh.newPage();await freshPage.goto(base);
    await freshPage.evaluate(()=>document.fonts.ready);
    result.mobileTransferBytes = await freshPage.evaluate(()=>performance.getEntriesByType('resource').reduce((sum,entry)=>sum+entry.transferSize,0)+performance.getEntriesByType('navigation')[0].transferSize);
    assert.ok(result.mobileTransferBytes<=700_000,`${name} mobile transfer budget: ${result.mobileTransferBytes}`);
    result.checks.push('fresh-context mobile transfer budget');
    await fresh.close();

    const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    const plainPage=await plain.newPage();
    await plainPage.goto(base);assert.equal(await plainPage.locator('.scenario-explanation:visible').count(),3);
    assert.equal(await plainPage.getByRole('heading',{name:'Selected work.'}).isVisible(),true);
    await plainPage.getByRole('link',{name:'Explore the story'}).click();
    assert.equal(await plainPage.getByRole('heading',{name:'The decision: give memory a budget'}).isVisible(),true);
    for(const state of ['one','queue','prefix']) {
      await plainPage.goto(base+`/design/states/${state}/`);
      assert.equal(await plainPage.locator('.scenario-explanation:visible').count(),3);
      for(const layer of await plainPage.locator(`[data-scenario="${state}"]`).all()) assert.equal(await layer.isVisible(),true);
      await checkOverflow(plainPage,`${name} no JavaScript ${state}`);
    }
    result.checks.push('homepage, work story navigation, and all three explanations readable without JavaScript; every initial SVG state');
    await plain.close();

    const motion=await browser.newContext({reducedMotion:'no-preference',viewport:{width:1440,height:1000}});
    const motionPage=await motion.newPage();
    motionPage.on('pageerror',error=>result.consoleErrors.push(error.message));
    await motionPage.goto(base);
    await motionPage.waitForFunction(()=>!!document.querySelector('[data-enhanced="true"]'));
    assert.equal(await motionPage.locator('.request-dot').evaluate(el=>el.getAnimations().length),0);
    await motionPage.getByRole('radio',{name:'A busy queue'}).check();
    assert.ok(await motionPage.locator('.request-dot').evaluate(el=>el.getAnimations().length)>0);
    await motionPage.waitForTimeout(1100);
    assert.equal(await motionPage.locator('.request-dot').evaluate(el=>el.getAnimations().length),0);
    // Rapid changes must also settle, with exactly one visible explanation.
    await motionPage.getByRole('radio',{name:'A shared prefix'}).check();
    await motionPage.getByRole('radio',{name:'One request'}).check();
    await motionPage.waitForTimeout(1100);
    assert.equal(await motionPage.locator('.request-dot').evaluate(el=>el.getAnimations().length),0);
    assert.equal(await motionPage.locator('.scenario-explanation:visible').count(),1);
    result.checks.push('no idle animation; deliberate animation plays once; rapid changes settle');
    if(name==='chromium') {
      for(const state of ['one','queue','prefix']) {
        await motionPage.goto(base+`/design/states/${state}/`);
        await motionPage.evaluate(()=>document.fonts.ready);
        const filename=`evidence/inference-${state}.png`;
        await motionPage.locator('.workbench').screenshot({path:filename});report.screenshots.push(filename);
      }
    }
    await motion.close();
    assert.equal(result.consoleErrors.filter(e=>!e.includes('404')).length,0);

    if(name==='chromium' || name==='webkit') {
      const touch=await browser.newContext({hasTouch:true,isMobile:true,reducedMotion:'reduce',viewport:{width:390,height:844}});
      const touchPage=await touch.newPage();await touchPage.goto(base);
      await touchPage.getByText('A shared prefix',{exact:true}).tap();
      assert.equal(await touchPage.getByRole('radio',{name:'A shared prefix'}).isChecked(),true);
      await checkOverflow(touchPage,`${name} touch`);
      result.checks.push('touch radio selection');await touch.close();
    }
  } catch(error) {result.status='failed';result.error=error.stack;report.failures.push({browser:name,error:error.message});}
  finally {await browser.close();report.browsers.push(result);}
}
await writeFile('evidence/browser-checks.json',JSON.stringify(report,null,2)+'\n');
for(const browser of report.browsers) console.log(`${browser.name}: ${browser.status}; ${browser.layouts?.length??0} layouts; ${browser.accessibility?.length??0} accessibility scans${browser.error?'\n'+browser.error:''}`);
assert.equal(report.failures.length,0,JSON.stringify(report.failures));
assert.ok(report.browsers.some(b=>b.status==='passed'),'No browser validation completed');
