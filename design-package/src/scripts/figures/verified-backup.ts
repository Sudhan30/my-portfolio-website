import { playable, q, setText } from './stage';
import { steps, nights, silent } from '../../content/figures/verified-backup';

const pillText = { pass: 'pass', fail: 'fail', skip: 'skipped' } as const;

playable('verified-backup', async (root, run) => {
  const outcome = q<SVGGElement>(root, '.vb-outcome');
  const count = q(root, '[data-out="count"]');
  const now = q<SVGGElement>(root, '.vb-now');

  if (run.choice === 'silent') {
    outcome.dataset.tone = 'ok';
    setText(q(root, '[data-out="outcome"]'), silent.outcome);
    if (!run.animate) {
      setText(count, String(silent.failures));
      void run.tween(now, { opacity: 1, transform: 'scale(1)' });
      void run.tween(outcome, { opacity: 1, transform: 'scale(1)' });
      return;
    }
    // Count the failures nobody received, then reroute the alarm.
    setText(count, '0');
    void run.tween(now, { opacity: 0 }, { duration: 0.1 });
    void run.tween(outcome, { opacity: 0 }, { duration: 0.1 });
    const frames = 36;
    for (let frame = 1; frame <= frames; frame++) {
      await run.wait(40);
      if (!run.alive()) return;
      setText(count, String(Math.round(silent.failures * (1 - (1 - frame / frames) ** 2))));
    }
    await run.wait(250);
    if (!run.alive()) return;
    await run.tween(now, { opacity: [0, 1], transform: ['scale(0.92)', 'scale(1)'] }, { duration: 0.4 });
    await run.tween(outcome, { opacity: [0, 1], transform: ['scale(0.97)', 'scale(1)'] }, { duration: 0.3 });
    return;
  }

  const night = nights[run.choice] ?? nights.good!;
  const rows = steps.map((step) => q<SVGGElement>(root, `[data-step="${step.id}"]`));
  const settle = (index: number) => {
    const step = steps[index]!;
    const state = night.states[step.id];
    rows[index]!.dataset.state = state;
    setText(q(rows[index]!, '.vb-detail'), night.details?.[step.id] ?? step.detail);
    setText(q(rows[index]!, '.vb-pill-text'), pillText[state]);
  };
  const settleOutcome = () => {
    outcome.dataset.tone = night.outcome.tone;
    setText(q(root, '[data-out="outcome"]'), night.outcome.text);
  };

  if (!run.animate) {
    rows.forEach((_, index) => settle(index));
    settleOutcome();
    void run.tween(outcome, { opacity: 1, transform: 'scale(1)' });
    return;
  }

  // Run the checks in order; a skipped step passes quickly, a real one takes a beat.
  rows.forEach((row, index) => {
    row.dataset.state = 'pending';
    setText(q(row, '.vb-detail'), night.details?.[steps[index]!.id] ?? steps[index]!.detail);
    setText(q(row, '.vb-pill-text'), '…');
  });
  void run.tween(outcome, { opacity: 0 }, { duration: 0.12 });
  for (const [index, row] of rows.entries()) {
    if (!run.alive()) return;
    if (night.states[steps[index]!.id] === 'skip') {
      await run.wait(90);
    } else {
      row.dataset.state = 'active';
      await run.wait(steps[index]!.id === 'restore' ? 620 : 380);
    }
    if (!run.alive()) return;
    settle(index);
  }
  settleOutcome();
  await run.tween(outcome, { opacity: [0, 1], transform: ['scale(0.97)', 'scale(1)'] }, { duration: 0.35 });
});

