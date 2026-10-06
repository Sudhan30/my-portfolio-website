// Argus, at the level of its principles only (README and ADR-001 to ADR-008).
// Every event here is synthetic. No rule, threshold, timing, host or provider
// from the real system appears in this figure.

export const sources = [
  { id: 'logs', label: 'Logs' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'signin', label: 'Sign-ins' },
  { id: 'cloud', label: 'Cloud' },
] as const;
export type SourceId = typeof sources[number]['id'];
export type Lane = 'high' | 'medium';

export interface Scenario {
  id: string; label: string;
  events: readonly { from: SourceId; to: Lane }[];
  blind: readonly SourceId[];
  brainSilent: boolean;
  modelNote: boolean;
  stats: { high: string; medium: string; blind: string; emailed: string; emailedBy: string };
  heading: string; body: string; note: string;
}

export const scenarios = [
  {
    id: 'normal', label: 'A normal hour',
    events: [{ from: 'logs', to: 'medium' }, { from: 'metrics', to: 'medium' }, { from: 'cloud', to: 'medium' }],
    blind: [], brainSilent: false, modelNote: true,
    stats: { high: '0', medium: '3', blind: '0', emailed: '0', emailedBy: '' },
    heading: 'Rules sort, then the hour waits',
    body: 'Events arrive from every source and pass through fixed rules. Nothing here is urgent, so three MEDIUM findings collect into a batch. By design, a local model may add a note to that batch to make it easier to read.',
    note: 'The note can explain a level. It can never change one.',
  },
  {
    id: 'high', label: 'A HIGH finding',
    events: [{ from: 'signin', to: 'high' }, { from: 'logs', to: 'medium' }],
    blind: [], brainSilent: false, modelNote: false,
    stats: { high: '1', medium: '1', blind: '0', emailed: '1', emailedBy: 'by rules' },
    heading: 'Serious goes straight to a person',
    body: 'A rule marks one sign-in event HIGH. It leaves at once, by email, without waiting for a batch and without passing near the model. The HIGH lane is locked: no model sits anywhere on that path.',
    note: 'Alerts fail open. A duplicate HIGH email is a nuisance; a missing one is the failure this exists to prevent.',
  },
  {
    id: 'blind', label: 'A source cannot be read',
    events: [{ from: 'logs', to: 'medium' }, { from: 'metrics', to: 'medium' }],
    blind: ['cloud'], brainSilent: false, modelNote: true,
    stats: { high: '0', medium: '2', blind: '1', emailed: '0', emailedBy: '' },
    heading: 'Blind is not zero',
    body: 'One read fails. Argus records that source as BLIND, never as zero findings. Zero would look like a quiet hour. BLIND says the honest thing: nobody looked.',
    note: 'A dashboard that turns a failed read into a reassuring 0 is worse than no dashboard.',
  },
  {
    id: 'quiet', label: 'The monitor goes quiet',
    events: [],
    blind: [], brainSilent: true, modelNote: false,
    stats: { high: '?', medium: '?', blind: '?', emailed: '1', emailedBy: 'by sentry' },
    heading: 'Someone watches the watcher',
    body: 'The brain inside the cluster stops checking in. A small sentry running off site notices the silence and sends an email itself. A monitor that only ran at home would go quiet exactly when home is the problem.',
    note: 'While the brain is silent, every count is unknown, so the figure shows a question mark, not a zero.',
  },
] as const satisfies readonly Scenario[];

export const sourceY = (index: number) => 24 + index * 62;
export const rulesCentre = { x: 285, y: 141 };
export const laneCentre: Record<Lane, { x: number; y: number }> = { high: { x: 404, y: 68 }, medium: { x: 404, y: 176 } };
