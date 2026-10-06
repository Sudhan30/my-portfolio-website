import { playable, choose, q, qa, setText } from './stage';
import { stages, plans, type StageId } from '../../content/figures/follow-click';

// Stage centres, in stage order, then the channel view. The packet starts on the first.
const centres: [number, number][] = [[104, 54], [300, 54], [496, 54], [496, 158], [300, 158], [104, 158], [104, 270]];
const offset = (index: number) => {
  const [x, y] = centres[index]!;
  return `translate(${x - centres[0]![0]}px, ${y - centres[0]![1]}px)`;
};

playable('follow-click', async (root, run) => {
  const plan = plans[run.choice] ?? plans.normal!;
  const stageEls = stages.map((stage) => q<SVGGElement>(root, `[data-stage="${stage.id}"]`));
  const packet = q<SVGGElement>(root, '.fc-packet');
  const today = q<SVGRectElement>(root, '.fc-today');
  const flag = q<SVGGElement>(root, '.fc-flag');
  const bars = qa<SVGRectElement>(root, '.fc-credit-bar');
  const values = qa<SVGTextElement>(root, '.fc-credit-value');

  qa<HTMLButtonElement>(root, '.fc-rule').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.rule === (run.choice === 'first' ? 'first' : 'credit'))));
  setText(q(root, '[data-out="rule"]'), run.choice === 'first' ? 'first touch' : 'last touch');
  values.forEach((value) => setText(value, value.dataset.touch === plan.credit ? '100%' : '0%'));
  today.dataset.today = plan.today;

  const settleStage = (index: number) => {
    const id = stages[index]!.id as StageId;
    stageEls[index]!.dataset.state = plan.states[id];
    setText(q(stageEls[index]!, '.fc-note'), plan.notes[id]);
  };
  const lastStage = plan.stopsAt === 'view' ? stages.length - 1 : stages.findIndex((stage) => stage.id === plan.stopsAt);
  const credited = (bar: SVGRectElement) => bar.dataset.touch === plan.credit;

  if (!run.animate) {
    stageEls.forEach((_, index) => settleStage(index));
    void run.tween(packet, { opacity: 0, transform: offset(0) });
    void run.tween(today, { transform: 'scaleY(1)', opacity: 1 });
    void run.tween(flag, { opacity: plan.today === 'held' ? 1 : 0, transform: 'scale(1)' });
    bars.forEach((bar) => void run.tween(bar, { transform: credited(bar) ? 'scaleY(1)' : 'scaleY(0)' }));
    return;
  }

  // Walk the click through each stage, settling a stage as it arrives.
  stageEls.forEach((stage, index) => {
    stage.dataset.state = 'pending';
    setText(q(stage, '.fc-note'), index === 0 ? plan.notes.channel : '…');
  });
  void run.tween(flag, { opacity: 0 }, { duration: 0.12 });
  if (plan.panel === 'view') void run.tween(today, { transform: 'scaleY(0)', opacity: 1 }, { duration: 0.12 });
  if (plan.panel === 'credit') bars.forEach((bar) => void run.tween(bar, { transform: 'scaleY(0)' }, { duration: 0.12 }));
  await run.tween(packet, { opacity: [0, 1], transform: offset(0) }, { duration: 0.2 });
  settleStage(0);
  for (let index = 1; index <= lastStage; index++) {
    if (!run.alive()) return;
    await run.tween(packet, { transform: offset(index) }, { duration: 0.34 });
    if (!run.alive()) return;
    settleStage(index);
    await run.wait(90);
  }
  for (let index = lastStage + 1; index < stages.length; index++) settleStage(index);
  if (!run.alive()) return;
  if (plan.stopsAt === 'view') {
    await run.tween(packet, { transform: offset(stages.length), opacity: [1, 0] }, { duration: 0.34 });
    if (!run.alive()) return;
    await run.tween(today, { transform: ['scaleY(0)', 'scaleY(1)'] }, { duration: 0.45 });
    return;
  }
  void run.tween(packet, { opacity: 0 }, { duration: 0.4 });
  if (plan.today === 'held') {
    void run.tween(today, { transform: 'scaleY(1)' }, { duration: 0 });
    await run.tween(flag, { opacity: [0, 1], transform: ['scale(0.9)', 'scale(1)'] }, { duration: 0.38 });
    return;
  }
  for (const bar of bars) {
    if (!run.alive()) return;
    if (credited(bar)) await run.tween(bar, { transform: ['scaleY(0)', 'scaleY(1)'] }, { duration: 0.5 });
  }
});

document.querySelectorAll<HTMLElement>('[data-playable="follow-click"]').forEach((root) => {
  root.querySelectorAll<HTMLButtonElement>('.fc-rule').forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.rule) choose(root, button.dataset.rule);
  }));
});
