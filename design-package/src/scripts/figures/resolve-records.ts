import { playable, choose, q, qa, setText } from './stage';
import { scenarios, records, levels, resolve, type Level } from '../../content/figures/resolve-records';

const tints = ['#D6EB77', '#dfe5ee', '#eee1d9', '#e2e9d5', '#F5F1E8'];
const orgFill = (index: number, flag?: string) => (flag === 'over' ? '#F58B70' : tints[index] ?? '#F5F1E8');
const recordY = (index: number) => 60 + index * 56;
const slotY = (index: number) => 60 + index * 88;
const wire = (recordIndex: number, slot: number) => `M266 ${recordY(recordIndex) + 25} C284 ${recordY(recordIndex) + 25} 282 ${slotY(slot) + 40} 300 ${slotY(slot) + 40}`;
const status = (flags: (string | undefined)[]) => flags.includes('over') ? 'Over-merged' : flags.includes('split') ? 'Split' : 'Resolved';

interface State { level: Level; deleted: boolean; }
const custom = new WeakMap<HTMLElement, State>();

function controls(root: HTMLElement) {
  return { level: q<HTMLInputElement>(root, '[data-in="level"]'), deleted: q<HTMLInputElement>(root, '[data-in="deleted"]') };
}
function readControls(root: HTMLElement): State {
  const c = controls(root);
  return { level: levels[Number(c.level.value)]?.id ?? 'balanced', deleted: c.deleted.checked };
}
function writeControls(root: HTMLElement, state: State) {
  const c = controls(root);
  const index = levels.findIndex((level) => level.id === state.level);
  c.level.value = String(index);
  c.level.setAttribute('aria-valuetext', levels[index]!.label);
  c.deleted.checked = state.deleted;
}

playable('resolve-records', async (root, run) => {
  const preset = scenarios.find((scenario) => scenario.id === run.choice);
  const state: State = preset ? { level: preset.level, deleted: preset.deleted } : custom.get(root) ?? readControls(root);
  if (preset) writeControls(root, state);
  const result = resolve(state.level, state.deleted);
  const level = levels.find((entry) => entry.id === state.level)!;
  const verdict = status(result.orgs.map((org) => org.flag));

  setText(q(root, '[data-out="count"]'), `${result.remaining} records → ${result.orgs.length} organizations`);
  setText(q<HTMLOutputElement>(root, '[data-out="level"]'), level.label);
  setText(q(root, '[data-out="rule"]'), `${level.rule}.`);
  setText(q(root, '[data-out="readout"]'), `${result.remaining} records resolve to ${result.orgs.length} organizations. ${verdict}.`);

  const recordGroups = records.map((record) => q<SVGGElement>(root, `[data-record="${record.id}"]`));
  const wires = records.map((record) => q<SVGPathElement>(root, `[data-wire="${record.id}"]`));
  const slots = qa<SVGGElement>(root, '.rr-org');
  const statusGroup = q<SVGGElement>(root, '.rr-status');

  const settleRecord = (index: number) => {
    const record = records[index]!;
    const cluster = result.clusterOf.get(record.id);
    recordGroups[index]!.dataset.deleted = String(cluster === undefined);
    recordGroups[index]!.dataset.odd = String(result.odd.has(record.id));
    q<SVGRectElement>(recordGroups[index]!, 'rect').setAttribute('fill', cluster === undefined ? '#F5F1E8' : orgFill(cluster, result.orgs[cluster]?.flag));
    wires[index]!.setAttribute('d', cluster === undefined ? `M266 ${recordY(index) + 25}h0` : wire(index, cluster));
    wires[index]!.dataset.hidden = String(cluster === undefined);
  };
  const fillSlot = (slot: number) => {
    const group = slots[slot]!;
    const org = result.orgs[slot];
    group.dataset.present = String(Boolean(org));
    group.dataset.flag = org?.flag ?? 'none';
    q<SVGRectElement>(group, 'rect').setAttribute('fill', org ? orgFill(slot, org.flag) : '#F5F1E8');
    setText(q(group, '[data-org="name"]'), org?.name ?? '');
    setText(q(group, '[data-org="members"]'), org ? `records ${org.members.join(', ')}` : '');
    setText(q(group, '[data-org="attributes"]'), org?.attributes.join(' · ') ?? '');
  };
  const settleStatus = () => {
    statusGroup.dataset.status = verdict;
    setText(q(statusGroup, '[data-out="status"]'), verdict);
  };

  if (!run.animate) {
    records.forEach((_, index) => settleRecord(index));
    slots.forEach((slot, index) => {
      fillSlot(index);
      void run.tween(slot, { opacity: result.orgs[index] ? 1 : 0, transform: 'translateX(0px)' });
    });
    settleStatus();
    return;
  }

  // Strike any deleted record, clear the board, then let each organization
  // gather its records in turn.
  records.forEach((record, index) => {
    const deleted = !result.clusterOf.has(record.id);
    recordGroups[index]!.dataset.deleted = String(deleted);
    recordGroups[index]!.dataset.odd = 'false';
    q<SVGRectElement>(recordGroups[index]!, 'rect').setAttribute('fill', '#F5F1E8');
    wires[index]!.dataset.hidden = 'true';
  });
  void run.tween(slots, { opacity: 0, transform: 'translateX(14px)' }, { duration: 0.18 });
  await run.wait(240);
  for (const [slot, org] of result.orgs.entries()) {
    if (!run.alive()) return;
    fillSlot(slot);
    org.members.forEach((id) => settleRecord(records.findIndex((record) => record.id === id)));
    await run.tween(slots[slot]!, { opacity: [0, 1], transform: ['translateX(14px)', 'translateX(0px)'] }, { duration: 0.34 });
    await run.wait(140);
  }
  if (!run.alive()) return;
  slots.forEach((_, index) => { if (!result.orgs[index]) fillSlot(index); });
  records.forEach((_, index) => settleRecord(index));
  settleStatus();
});

document.querySelectorAll<HTMLElement>('[data-playable="resolve-records"]').forEach((root) => {
  root.querySelectorAll('[data-in]').forEach((input) => input.addEventListener('input', () => {
    custom.set(root, readControls(root));
    choose(root, 'custom', true);
  }));
});
