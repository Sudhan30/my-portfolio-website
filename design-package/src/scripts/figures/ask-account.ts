import { playable, q, qa, setText } from './stage';
import { scenarios, sources, threshold } from '../../content/figures/ask-account';

const unit = 80;
const sourceY = (index: number) => 104 + index * 62;

playable('ask-account', async (root, run) => {
  const scenario = scenarios.find((entry) => entry.id === run.choice) ?? scenarios[0];
  const used = new Set<string>(scenario.used);
  const tiles = sources.map((source) => q<SVGGElement>(root, `[data-source="${source.id}"]`));
  const wires = sources.map((source) => q<SVGPathElement>(root, `[data-wire="${source.id}"]`));
  const rows = qa<SVGGElement>(root, '.aa-row');
  const bars = rows.map((row) => q<SVGRectElement>(row, '.aa-bar'));
  const answer = q<SVGGElement>(root, '.aa-answer');
  const pulses = qa<SVGGElement>(root, '.aa-pulse');

  const stateOf = (id: string) => (used.has(id) ? 'on' : id === 'identity' && !scenario.identity ? 'off' : 'idle');
  const settleSources = () => sources.forEach((source, index) => {
    tiles[index]!.dataset.on = stateOf(source.id);
    wires[index]!.dataset.on = used.has(source.id) ? 'on' : 'idle';
  });
  const settleAnswer = () => {
    answer.dataset.missed = String(!scenario.identity);
    scenario.answer.forEach((line, index) => setText(q(answer, `[data-answer="${index}"]`), line));
    setText(q(root, '[data-out="cites"]'), scenario.cites);
  };

  // Bars and labels are layout, not motion: set them first, every run.
  setText(q(root, '[data-out="question"]'), scenario.question);
  setText(q(root, '[data-out="meter"]'), scenario.meter);
  rows.forEach((row, index) => {
    const bar = scenario.bars[index] as { name: string; value: number; fragment?: boolean } | undefined;
    row.dataset.present = String(Boolean(bar));
    row.dataset.fragment = String(Boolean(bar?.fragment));
    setText(q(row, '[data-label]'), bar?.name ?? '');
    const rect = bars[index]!;
    rect.setAttribute('width', String(Math.max(1, (bar?.value ?? 0) * unit)));
    rect.setAttribute('fill', bar?.fragment ? '#F58B70' : (bar?.value ?? 0) >= threshold ? '#D6EB77' : '#F5F1E8');
    rect.dataset.zero = String(!bar?.value);
  });

  if (!run.animate) {
    settleSources();
    settleAnswer();
    void run.tween(pulses, { opacity: 0, transform: 'translate(0px, 0px)' });
    void run.tween(bars, { transform: 'scaleX(1)' });
    void run.tween(answer, { opacity: 1, transform: 'scale(1)' });
    return;
  }

  // Read the sources one by one, then answer, then show the evidence.
  sources.forEach((source, index) => {
    tiles[index]!.dataset.on = source.id === 'identity' && !scenario.identity ? 'off' : 'idle';
    wires[index]!.dataset.on = 'idle';
  });
  void run.tween(bars, { transform: 'scaleX(0)' }, { duration: 0.15 });
  void run.tween(answer, { opacity: 0.3, transform: 'scale(0.97)' }, { duration: 0.15 });
  await run.wait(180);
  for (const [index, source] of sources.entries()) {
    if (!used.has(source.id)) continue;
    if (!run.alive()) return;
    tiles[index]!.dataset.on = 'on';
    wires[index]!.dataset.on = 'on';
    const dy = 223 - (sourceY(index) + 26);
    await run.tween(pulses[index]!, { opacity: [0, 1, 1, 0], transform: ['translate(0px, 0px)', `translate(16px, ${dy}px)`] }, { duration: 0.42 });
  }
  if (!run.alive()) return;
  await run.tween(pulses[sources.length]!, { opacity: [0, 1, 1, 0], transform: ['translate(0px, 0px)', 'translate(20px, 0px)'] }, { duration: 0.3 });
  if (!run.alive()) return;
  settleAnswer();
  void run.tween(answer, { opacity: [0.3, 1], transform: ['scale(0.97)', 'scale(1)'] }, { duration: 0.36 });
  for (const [index, bar] of bars.entries()) {
    if (!run.alive()) return;
    if (!scenario.bars[index]) continue;
    await run.tween(bar, { transform: ['scaleX(0)', 'scaleX(1)'] }, { duration: 0.3 });
  }
  if (!run.alive()) return;
  settleSources();
});
