import { playable, q, qa, setText } from './stage';
import { scenarios, sources, sourceY, rulesCentre, laneCentre } from '../../content/figures/severity-gate';

const show = (el: Element, visible: boolean) => (visible ? el.removeAttribute('display') : el.setAttribute('display', 'none'));

playable('severity-gate', async (root, run) => {
  const scenario = scenarios.find((entry) => entry.id === run.choice) ?? scenarios[0];
  const blind = scenario.blind as readonly string[];
  const sourceCards = qa<SVGGElement>(root, '.sg-source');
  const tokens = qa<SVGGElement>(root, '.sg-token');
  const model = q<SVGGElement>(root, '.sg-model');
  const brain = q<SVGGElement>(root, '.sg-brain');
  const mail = q<SVGGElement>(root, '.sg-mail');
  const pulse = q<SVGGElement>(root, '.sg-pulse');
  const statKeys = ['high', 'medium', 'blind', 'emailed'] as const;

  const settleSources = () => sourceCards.forEach((card) => {
    const isBlind = blind.includes(card.dataset.source ?? '');
    card.dataset.state = isBlind ? 'blind' : 'ok';
    setText(q(card, '[data-out="status"]'), isBlind ? 'BLIND' : 'read ok');
  });
  const settleWatchers = () => {
    brain.dataset.state = scenario.brainSilent ? 'silent' : 'alive';
    setText(q(root, '[data-out="brain"]'), scenario.brainSilent ? 'silent' : 'in the cluster');
    show(q(root, '[data-beat="alive"]'), !scenario.brainSilent);
    show(q(root, '[data-beat="silent"]'), scenario.brainSilent);
    show(mail, scenario.brainSilent);
  };
  const settleStats = () => {
    statKeys.forEach((key) => setText(q(root, `[data-out="stat-${key}"]`), scenario.stats[key]));
    setText(q(root, '[data-out="emailed-by"]'), scenario.stats.emailedBy);
    model.dataset.active = String(scenario.modelNote);
  };

  if (!run.animate) {
    settleSources(); settleWatchers(); settleStats();
    void run.tween(tokens, { opacity: 0, transform: 'translate(0px, 0px)' });
    void run.tween(pulse, { opacity: 0, transform: 'translate(0px, 0px)' });
    void run.tween(mail, { opacity: 1, transform: 'scale(1)' });
    return;
  }

  settleSources();
  settleWatchers();
  model.dataset.active = 'false';
  statKeys.forEach((key) => setText(q(root, `[data-out="stat-${key}"]`), scenario.brainSilent ? scenario.stats[key] : '0'));
  setText(q(root, '[data-out="stat-blind"]'), scenario.stats.blind);
  setText(q(root, '[data-out="emailed-by"]'), '');
  void run.tween(tokens, { opacity: 0 }, { duration: 0.01 });

  if (scenario.brainSilent) {
    // The heartbeat stops; the sentry speaks for itself.
    await run.wait(250);
    if (!run.alive()) return;
    await run.tween(mail, { opacity: [0, 1], transform: ['scale(0.6)', 'scale(1)'] }, { duration: 0.45 });
    settleStats();
    return;
  }

  // A heartbeat crosses to the sentry while events flow through the rules.
  void run.tween(pulse, { opacity: [0, 1, 1, 0], transform: ['translate(0px, 0px)', 'translate(168px, 0px)'] }, { duration: 1.1, ease: 'linear' });
  let high = 0; let medium = 0;
  for (const [index, event] of scenario.events.entries()) {
    if (!run.alive()) return;
    const token = tokens[index];
    if (!token) break;
    const from = sources.findIndex((source) => source.id === event.from);
    const start = { x: 172, y: sourceY(from) + 27 };
    const lane = laneCentre[event.to];
    await run.tween(token, { opacity: [0, 1, 1], transform: [`translate(${start.x}px, ${start.y}px)`, `translate(${rulesCentre.x}px, ${rulesCentre.y}px)`] }, { duration: 0.4 });
    if (!run.alive()) return;
    await run.tween(token, { opacity: [1, 1, 0], transform: [`translate(${rulesCentre.x}px, ${rulesCentre.y}px)`, `translate(${lane.x + 20}px, ${lane.y}px)`] }, { duration: 0.35 });
    if (event.to === 'high') high++; else medium++;
    setText(q(root, '[data-out="stat-high"]'), String(high));
    setText(q(root, '[data-out="stat-medium"]'), String(medium));
    if (event.to === 'high') void run.tween(q(root, '[data-lane="high"]'), { transform: ['scale(1.04)', 'scale(1)'] }, { duration: 0.3 });
  }
  if (!run.alive()) return;
  await run.wait(150);
  settleStats();
});
