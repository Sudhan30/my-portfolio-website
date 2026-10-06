import assert from 'node:assert/strict';

// Checks every story page that carries a playable figure. Shared by the design
// browser check and the production browser check, so both prove the same
// behaviour; the production one runs it under the real CSP.
//
// 1. Reduced motion: arrow keys move through the chips, exactly the matching
//    explanation shows, and nothing is left animating.
// 2. Motion: the opening play settles, a deliberate choice animates, then settles.
// 3. No JavaScript: the figure is drawn, the chips are hidden, and every
//    scenario's explanation is readable.

const settled = (el) => el.getAnimations({ subtree: true }).filter((a) => a.playState === 'running').length === 0;

async function waitSettled(page, route, label) {
  await page.waitForFunction(() => {
    const el = document.querySelector('.play');
    return !!el && el.getAnimations({ subtree: true }).every((a) => a.playState !== 'running');
  }, undefined, { timeout: 9000 }).catch(() => assert.fail(`${route}: ${label} did not settle`));
}

export async function checkPlayables(browser, base, routes, { cspViolations = false } = {}) {
  const stories = routes.filter((route) => route.startsWith('/work/'));
  const checked = [];

  const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 1000 } });
  const page = await reduced.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  if (cspViolations) await page.addInitScript(() => { window.__cspViolations = []; document.addEventListener('securitypolicyviolation', (event) => window.__cspViolations.push(event.violatedDirective)); });
  for (const route of stories) {
    await page.goto(base + route);
    const play = page.locator('.play');
    if (await play.count() === 0) continue;
    assert.equal(await play.count(), 1, `${route}: one playable figure`);
    await page.waitForFunction(() => document.querySelector('.play')?.dataset.enhanced === 'true');
    const radios = play.locator('.scenario-controls input[type=radio]');
    const count = await radios.count();
    assert.ok(count >= 2, `${route}: at least two scenarios`);
    const name = await radios.first().getAttribute('name');
    await radios.first().focus();
    for (let index = 1; index < count; index++) {
      await page.keyboard.press('ArrowRight');
      const value = await radios.nth(index).getAttribute('value');
      assert.equal(await radios.nth(index).isChecked(), true, `${route}: arrow key reaches chip ${index}`);
      await page.waitForTimeout(400);
      const visible = play.locator('.scenario-explanation:visible');
      assert.equal(await visible.count(), 1, `${route}: one explanation for ${value}`);
      assert.equal(await visible.getAttribute('id'), `${name}-${value}`, `${route}: explanation matches ${value}`);
      assert.ok(await play.evaluate(settled), `${route}: reduced motion leaves ${value} settled`);
    }
    if (cspViolations) assert.deepEqual(await page.evaluate(() => window.__cspViolations), [], `${route}: CSP violations`);
    checked.push(route);
  }
  assert.deepEqual(errors, [], 'playable figures raised page errors');
  await reduced.close();

  const moving = await browser.newContext({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 1000 } });
  const motionPage = await moving.newPage();
  motionPage.on('pageerror', (error) => errors.push(error.message));
  for (const route of checked) {
    await motionPage.goto(base + route);
    const play = motionPage.locator('.play');
    await play.scrollIntoViewIfNeeded();
    await motionPage.waitForFunction(() => document.querySelector('.play')?.dataset.enhanced === 'true');
    await motionPage.waitForTimeout(300);
    await waitSettled(motionPage, route, 'opening play');
    await play.locator('.scenario-controls input[type=radio]').nth(1).check();
    await motionPage.waitForTimeout(120);
    assert.ok(!(await play.evaluate(settled)), `${route}: a deliberate choice animates`);
    await waitSettled(motionPage, route, 'deliberate choice');
    assert.equal(await play.locator('.scenario-explanation:visible').count(), 1, `${route}: one explanation after motion`);
  }
  assert.deepEqual(errors, [], 'playable figures raised page errors under motion');
  await moving.close();

  const plain = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const plainPage = await plain.newPage();
  for (const route of checked) {
    await plainPage.goto(base + route);
    const play = plainPage.locator('.play');
    assert.equal(await play.locator('svg').first().isVisible(), true, `${route}: figure drawn without JavaScript`);
    assert.equal(await play.locator('.scenario-controls').isVisible(), false, `${route}: chips hidden without JavaScript`);
    assert.equal(await play.locator('.scenario-explanation:visible').count(), await play.locator('.scenario-controls input[type=radio]').count(), `${route}: every explanation readable without JavaScript`);
  }
  await plain.close();
  return checked;
}
