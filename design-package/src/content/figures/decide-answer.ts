// The chat app's grounding gate and SQL boundary, from chat-sudharsana-dev
// (src/lib/grounding.ts, src/lib/graph.ts, src/lib/agent.ts at 9d742c3).
// Every score below is what the real needsGrounding() returned for that exact
// question. Replies and row counts are illustrative.

export type NodeId = 'gate' | 'chat' | 'decide' | 'refuse' | 'tools' | 'reask' | 'answer';
export type PanelKind = 'none' | 'tool' | 'sql-pass' | 'sql-reject' | 'refuse';

export const nodes: Record<NodeId, { x: number; y: number; w: number; label: string }> = {
  gate: { x: 16, y: 300, w: 96, label: 'Gate' },
  chat: { x: 150, y: 244, w: 120, label: 'chat' },
  decide: { x: 150, y: 300, w: 120, label: 'decide' },
  refuse: { x: 150, y: 356, w: 120, label: 'refuse' },
  tools: { x: 316, y: 300, w: 116, label: 'tools' },
  reask: { x: 316, y: 356, w: 116, label: 'reask' },
  answer: { x: 470, y: 300, w: 114, label: 'answer' },
};
export const nodeHeight = 46;
export const centre = (id: NodeId) => ({ x: nodes[id].x + nodes[id].w / 2, y: nodes[id].y + nodeHeight / 2 });

export const edges = [
  { id: 'gate-chat', d: 'M112 323 C132 323 130 267 150 267' },
  { id: 'gate-decide', d: 'M112 323 H150' },
  { id: 'gate-refuse', d: 'M112 323 C132 323 130 379 150 379' },
  { id: 'decide-tools', d: 'M270 323 H316' },
  { id: 'decide-reask', d: 'M270 323 C293 323 293 379 316 379' },
  { id: 'reask-tools', d: 'M374 356 V346' },
  { id: 'tools-answer', d: 'M432 323 H470' },
] as const;
export type EdgeId = typeof edges[number]['id'];

export interface Hit { term: string; points: number; }
export interface Scenario {
  id: string; label: string; question: readonly string[];
  hits: readonly Hit[]; score: number;
  need: string; route: readonly NodeId[]; panel: PanelKind;
  heading: string; body: string; note: string;
}

export const scenarios = [
  {
    id: 'explain', label: 'Explain a concept', question: ['Explain how a NetworkPolicy works'],
    hits: [{ term: 'explain', points: -2 }], score: -2, need: 'no tool needed',
    route: ['gate', 'chat'], panel: 'none',
    heading: 'A concept needs no tool',
    body: '“Explain” is a generative frame, so the score drops to minus 2 and no live subject fires. The gate sends the question to the chat node, and a local model answers from what it knows.',
    note: 'Ordinary conversation stays ordinary. A definition never goes looking for pods.',
  },
  {
    id: 'pods', label: 'Pods right now', question: ['How many pods are running right now?'],
    hits: [{ term: 'pods', points: 2 }, { term: 'right now', points: 2 }, { term: 'are', points: 1 }, { term: 'how many', points: 1 }, { term: 'running', points: 1 }],
    score: 7, need: 'tool required', route: ['gate', 'decide', 'tools', 'answer'], panel: 'tool',
    heading: 'A live question must touch live data',
    body: '“Pods” is a live subject and “right now” points at this moment. With a live subject and a score of 7, a tool is required. In the decide node the model has to call one; it reads the pods, and the answer is written from what came back.',
    note: 'Borderline questions fire on purpose. An unneeded tool call costs about 200ms. An invented answer about your own cluster costs far more.',
  },
  {
    id: 'comments', label: 'Blog comments', question: ['How many comments did the blog', 'get this week?'],
    hits: [{ term: 'comments', points: 2 }, { term: 'blog', points: 2 }, { term: 'did', points: 1 }, { term: 'how many', points: 1 }, { term: 'this week', points: 1 }],
    score: 7, need: 'tool required', route: ['gate', 'decide', 'tools', 'answer'], panel: 'sql-pass',
    heading: 'The query passes the boundary',
    body: 'The model proposes a query. The application checks it, not the model: SELECT or WITH only, no SQL comments, one statement, nothing from the forbidden list. Then it wraps the query in a 100 row cap and runs it in a read only transaction with a 10 second timeout.',
    note: 'Rows are redacted before the model sees them. Blog comments carry other people’s names and emails.',
  },
  {
    id: 'delete', label: 'Delete comments', question: ['Delete the spam comments on my blog'],
    hits: [{ term: 'comments', points: 2 }, { term: 'blog', points: 2 }, { term: 'my', points: 2 }],
    score: 6, need: 'tool required', route: ['gate', 'decide', 'tools', 'answer'], panel: 'sql-reject',
    heading: 'The boundary says no',
    body: 'This is still a question about live data, so the gate requires a tool. The model proposes a DELETE. The validator stops it before it reaches the database, and the answer explains that it can only read.',
    note: 'The read-only transaction is a second layer: a write that slipped past the check would still be refused.',
  },
  {
    id: 'alerts', label: 'Alerts last week', question: ['How many alerts fired last week?'],
    hits: [{ term: 'alerts', points: 2 }, { term: 'how many', points: 1 }, { term: 'last week', points: 1 }],
    score: 4, need: 'no tool can answer', route: ['gate', 'refuse'], panel: 'refuse',
    heading: 'Honest about a blind spot',
    body: 'The score clears the bar, but none of the agent’s tools can read alerts, so no tool can answer. The gate routes straight to refuse, before any model call. The reply is written by code, and it says plainly what it did not read.',
    note: 'This replaced a real mistake: the question once went to the pod tool, and pod counts came back presented as alerts.',
  },
] as const satisfies readonly Scenario[];

/** Lay hit chips into rows no wider than the figure. */
export function chipRows(hits: readonly Hit[]) {
  const rows: { term: string; label: string; x: number; y: number; w: number; points: number }[] = [];
  let x = 16; let y = 146;
  for (const hit of hits) {
    const label = `${hit.term}  ${hit.points > 0 ? '+' : '−'}${Math.abs(hit.points)}`;
    const w = Math.round(label.length * 10.4 + 30);
    if (x + w > 584) { x = 16; y += 44; }
    rows.push({ term: hit.term, label, x, y, w, points: hit.points });
    x += w + 8;
  }
  return rows;
}

/** Edges a route walks, in order. */
export function routeEdges(route: readonly NodeId[]): EdgeId[] {
  const ids: EdgeId[] = [];
  for (let i = 1; i < route.length; i++) ids.push(`${route[i - 1]}-${route[i]}` as EdgeId);
  return ids;
}
