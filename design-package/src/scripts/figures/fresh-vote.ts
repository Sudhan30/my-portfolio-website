import { playable, choose, q, qa, setText } from './stage';
import { scenarios, ages, verdict, type Probe, type PolicyId } from '../../content/figures/fresh-vote';

const stampFill = { FRESH: '#D6EB77', STALE: '#F58B70', UNKNOWN: '#F5F1E8' } as const;
const signalOrder = ['headers', 'fingerprint', 'liveness', 'policy'] as const;
const custom = new WeakMap<HTMLElement, Probe>();

function controls(root: HTMLElement) {
  return {
    age: q<HTMLInputElement>(root, '[data-in="age"]'),
    policy: q<HTMLSelectElement>(root, '[data-in="policy"]'),
    body: q<HTMLInputElement>(root, '[data-in="body"]'),
    healthy: q<HTMLInputElement>(root, '[data-in="healthy"]'),
  };
}

function readControls(root: HTMLElement): Probe {
  const c = controls(root);
  return {
    ageSeconds: ages[Number(c.age.value)]?.seconds ?? ages[0].seconds,
    policy: c.policy.value as PolicyId,
    bodyChanging: c.body.checked,
    healthy: c.healthy.checked,
  };
}

function writeControls(root: HTMLElement, probe: Probe) {
  const c = controls(root);
  const index = Math.max(0, ages.findIndex((age) => age.seconds === probe.ageSeconds));
  c.age.value = String(index);
  c.age.setAttribute('aria-valuetext', ages[index]!.label);
  c.policy.value = probe.policy;
  c.body.checked = probe.bodyChanging;
  c.healthy.checked = probe.healthy;
}

playable('fresh-vote', async (root, run) => {
  const preset = scenarios.find((scenario) => scenario.id === run.choice);
  const probe: Probe = preset ? { ...preset.probe } : custom.get(root) ?? readControls(root);
  if (preset) writeControls(root, probe);
  const result = verdict(probe);
  const age = ages.find((entry) => entry.seconds === probe.ageSeconds)!;
  const confidence = result.confidence.toFixed(2);

  setText(q(root, '[data-out="age"]'), age.label);
  setText(q(root, '[data-out="body"]'), probe.bodyChanging ? 'changes' : 'never changes');
  setText(q(root, '[data-out="latency"]'), probe.healthy ? 'steady' : 'spiky');
  setText(q<HTMLOutputElement>(root, '[data-out="age-value"]'), age.label);

  const tiles = signalOrder.map((id) => q<SVGGElement>(root, `[data-signal="${id}"]`));
  const segments = qa<SVGRectElement>(root, '.fv-seg');
  const pulses = qa<SVGGElement>(root, '.fv-pulse');
  const stamp = q<SVGGElement>(root, '.fv-stamp');
  const stampRect = q<SVGRectElement>(stamp, 'rect');
  const settleTile = (tile: SVGGElement, id: typeof signalOrder[number]) => {
    tile.dataset.vote = result.signals[id] ? 'fresh' : 'stale';
    setText(q(tile, '.fv-pill-text'), result.signals[id] ? 'fresh' : 'stale');
  };
  const settleVerdict = () => {
    stamp.dataset.verdict = result.verdict;
    stampRect.setAttribute('fill', stampFill[result.verdict]);
    setText(q(root, '[data-out="verdict"]'), result.verdict);
    setText(q(root, '[data-out="confidence"]'), `confidence ${confidence}`);
    setText(q(root, '[data-out="tally"]'), `${result.fresh} of 4 fresh`);
    setText(q(root, '[data-out="readout"]'), `${result.fresh} of 4 signals fresh: ${result.verdict}, confidence ${confidence}.`);
  };
  segments.forEach((segment, index) => segment.setAttribute('fill', index < result.fresh ? '#D6EB77' : '#F5F1E8'));

  if (!run.animate) {
    tiles.forEach((tile, index) => settleTile(tile, signalOrder[index]!));
    pulses.forEach((pulse) => void run.tween(pulse, { opacity: 0, transform: 'translate(0px, 0px)' }));
    void run.tween(segments, { transform: 'scaleX(1)' });
    void run.tween(stamp, { opacity: 1, transform: 'scale(1)' });
    settleVerdict();
    return;
  }

  // Ask each signal in turn, fill the bar one vote at a time, then stamp.
  tiles.forEach((tile) => { tile.dataset.vote = 'pending'; setText(q(tile, '.fv-pill-text'), '…'); });
  void run.tween(segments, { transform: 'scaleX(0)' }, { duration: 0.15 });
  void run.tween(stamp, { opacity: 0.25 }, { duration: 0.15 });
  await run.wait(160);
  for (const [index, pulse] of pulses.entries()) {
    if (!run.alive()) return;
    const dy = 24 + index * 60 + 28 - 146;
    void run.tween(pulse, { opacity: [0, 1, 1, 0], transform: ['translate(0px, 0px)', `translate(26px, ${dy}px)`] }, { duration: 0.42 });
    await run.wait(300);
    if (!run.alive()) return;
    settleTile(tiles[index]!, signalOrder[index]!);
    await run.wait(120);
  }
  for (const segment of segments) {
    if (!run.alive()) return;
    await run.tween(segment, { transform: ['scaleX(0)', 'scaleX(1)'] }, { duration: 0.22 });
  }
  if (!run.alive()) return;
  settleVerdict();
  await run.tween(stamp, { opacity: [0.25, 1], transform: ['scale(0.92)', 'scale(1)'] }, { duration: 0.38 });
});

document.querySelectorAll<HTMLElement>('[data-playable="fresh-vote"]').forEach((root) => {
  root.querySelectorAll('[data-in]').forEach((input) => input.addEventListener('input', () => {
    custom.set(root, readControls(root));
    choose(root, 'custom', false);
  }));
});
