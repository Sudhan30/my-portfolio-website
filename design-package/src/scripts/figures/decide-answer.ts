import { playable, q, qa, setText } from './stage';
import { scenarios, centre, routeEdges, type NodeId } from '../../content/figures/decide-answer';

const signed = (n: number) => (n < 0 ? `−${Math.abs(n)}` : String(n));

playable('decide-answer', async (root, run) => {
  const scenario = scenarios.find((entry) => entry.id === run.choice) ?? scenarios[0];
  const route = scenario.route as readonly NodeId[];
  const onEdges: string[] = routeEdges(route);

  // Swap the per-scenario layers: the question, its chips and the bottom panel.
  qa(root, '.da-question, .da-hits').forEach((layer) => {
    if ((layer as SVGElement).dataset.for === scenario.id) layer.removeAttribute('display');
    else layer.setAttribute('display', 'none');
  });
  qa(root, '.da-panel').forEach((panel) => {
    if ((panel as SVGElement).dataset.panel === scenario.panel) panel.removeAttribute('display');
    else panel.setAttribute('display', 'none');
  });
  const chips = qa<SVGGElement>(root, `.da-hits[data-for="${scenario.id}"] .da-chip`);
  const nodes = qa<SVGGElement>(root, '.da-node');
  const edges = qa<SVGPathElement>(root, '.da-edge');
  const dot = q<SVGGElement>(root, '.da-dot');
  const panel = q<SVGGElement>(root, `.da-panel[data-panel="${scenario.panel}"]`);
  const score = q(root, '[data-out="score"]');
  const need = q(root, '[data-out="need"]');

  const settleNodes = (upTo: number) => {
    nodes.forEach((node) => {
      const index = route.indexOf(node.dataset.node as NodeId);
      node.dataset.state = index < 0 || index > upTo ? 'off' : index === route.length - 1 ? 'end' : 'on';
    });
    edges.forEach((edge) => {
      const index = onEdges.indexOf(edge.dataset.edge ?? '');
      edge.dataset.on = String(index >= 0 && index < upTo);
    });
  };

  if (!run.animate) {
    void run.tween(chips, { opacity: 1, transform: 'translateY(0px)' });
    void run.tween(dot, { opacity: 0, transform: 'translate(0px, 0px)' });
    void run.tween(panel, { opacity: 1 });
    setText(score, signed(scenario.score));
    setText(need, scenario.need);
    settleNodes(route.length - 1);
    return;
  }

  // Score the question one term at a time.
  settleNodes(-1);
  setText(score, '0');
  setText(need, 'scoring');
  void run.tween(panel, { opacity: 0 }, { duration: 0.12 });
  void run.tween(chips, { opacity: 0, transform: 'translateY(8px)' }, { duration: 0.01 });
  await run.wait(120);
  let total = 0;
  for (const [index, chip] of chips.entries()) {
    if (!run.alive()) return;
    total += scenario.hits[index]!.points;
    void run.tween(chip, { opacity: [0, 1], transform: ['translateY(8px)', 'translateY(0px)'] }, { duration: 0.3 });
    setText(score, signed(total));
    await run.wait(260);
  }
  if (!run.alive()) return;
  setText(need, scenario.need);
  await run.wait(260);

  // Then walk the route the gate chose.
  const origin = centre('gate');
  void run.tween(dot, { opacity: 1, transform: 'translate(0px, 0px)' }, { duration: 0.15 });
  settleNodes(0);
  for (let step = 1; step < route.length; step++) {
    if (!run.alive()) return;
    const target = centre(route[step]!);
    await run.tween(dot, { transform: `translate(${target.x - origin.x}px, ${target.y - origin.y}px)` }, { duration: 0.45 });
    if (!run.alive()) return;
    settleNodes(step);
  }
  void run.tween(dot, { opacity: 0 }, { duration: 0.25 });
  await run.tween(panel, { opacity: [0, 1] }, { duration: 0.35 });
});
