// The nightly backup check, as written in the homelab's postgres_backup_verify
// DAG, and the alerting failure recorded in its blog_summaries DAG. Steps,
// thresholds and the failure count come from those files; nothing is invented.

export type StepState = 'pass' | 'fail' | 'skip';

export const steps = [
  { id: 'fresh', label: 'Freshness', detail: 'newest dump under 26 hours old' },
  { id: 'intact', label: 'Integrity', detail: 'archive intact, six databases present' },
  { id: 'restore', label: 'Restore', detail: 'load one into a scratch database' },
  { id: 'counts', label: 'Row counts', detail: 'tables match, comments not above live' },
  { id: 'cleanup', label: 'Cleanup', detail: 'drop scratch, even after a failure' },
] as const;
export type StepId = typeof steps[number]['id'];

export interface Night {
  states: Record<StepId, StepState>;
  /** Step details that read differently on this night. */
  details?: Partial<Record<StepId, string>>;
  outcome: { tone: 'ok' | 'alert'; text: string };
}

export const nights: Record<string, Night> = {
  good: {
    states: { fresh: 'pass', intact: 'pass', restore: 'pass', counts: 'pass', cleanup: 'pass' },
    outcome: { tone: 'ok', text: 'One database proven restorable tonight. No alert.' },
  },
  dead: {
    states: { fresh: 'fail', intact: 'skip', restore: 'skip', counts: 'skip', cleanup: 'skip' },
    details: { fresh: 'newest dump is 31 hours old' },
    outcome: { tone: 'alert', text: 'Alert: no dump in 26 hours' },
  },
  client: {
    states: { fresh: 'pass', intact: 'pass', restore: 'fail', counts: 'skip', cleanup: 'pass' },
    details: { restore: 'server rejects a setting in the dump' },
    outcome: { tone: 'alert', text: 'Alert: this dump does not restore' },
  },
};

export const silent = { failures: 483, outcome: 'Fixed: every failure now reaches a person' } as const;

export const scenarios = [
  {
    id: 'good', label: 'A good night',
    heading: 'Restore it, then believe it',
    body: 'The dump runs at 03:00 and the check at 04:00. It confirms the file is recent and intact, loads one database into a scratch copy, compares it with live, and drops the copy.',
    note: 'A backup nobody has restored is a hope. This turns it into a fact every morning.',
  },
  {
    id: 'dead', label: 'A dead schedule',
    heading: 'Catch the job that stopped',
    body: 'The newest dump is 31 hours old, so the nightly job has not run. Nothing errored; it simply stopped. The first check fails, the rest are skipped, and an alert goes out.',
    note: '26 hours allows one late run to pass while a dead schedule still gets caught.',
  },
  {
    id: 'client', label: 'The wrong client',
    heading: 'The failure only a restore can find',
    body: 'A dump taken with a newer database client looks perfect. The archive is intact and all six databases are there. Then the restore stops on its first statement, because the dump carries a setting the older server rejects.',
    note: 'This is the case the restore step exists for. Every check before it said yes.',
  },
  {
    id: 'silent', label: 'Who hears the failure?',
    heading: 'A check nobody hears is not a check',
    body: 'A different job, the nightly blog comment summaries, failed 483 times in a row from March to August. Its alerts went to a notification service that had been deleted, so every failure went nowhere.',
    note: 'Failures now go to a channel a person reads. When I build a check, I also check where its alarm lands.',
  },
] as const;
