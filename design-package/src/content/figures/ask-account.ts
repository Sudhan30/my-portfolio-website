// Ask the account: a seller's question, the sources an agent reads, and the
// answer it gives. Every company, signal and count here is illustrative.

export const sources = [
  { id: 'behavior', name: 'Behavior' },
  { id: 'intent', name: 'Intent' },
  { id: 'engagement', name: 'Engagement' },
  { id: 'identity', name: 'Shared identity' },
] as const;
export type SourceId = typeof sources[number]['id'];

/** Signals an account needs before the agent surfaces it. */
export const threshold = 3;

export interface Bar { name: string; value: number; fragment?: boolean; }

export const scenarios = [
  {
    id: 'intent', label: 'Which accounts show intent?',
    question: 'Which accounts show buying intent this week?',
    used: ['behavior', 'intent', 'identity'], identity: true,
    meter: 'Intent signals per account',
    bars: [{ name: 'Northwind Traders', value: 3 }, { name: 'Contoso', value: 2 }, { name: 'Fabrikam', value: 1 }],
    answer: ['Northwind Traders', 'Signals this week:', 'pricing visits,', 'a demo request,', 'a reorder spike.'],
    cites: 'Cites intent, behavior',
    heading: 'Grounded in what accounts did',
    body: 'The agent reads behavior and intent signals, joined through one shared customer identity, and answers with the account and the evidence behind it.',
    note: 'A seller can check every claim, because the answer names its signals.',
  },
  {
    id: 'reengage', label: 'Who should Marketing re-engage?',
    question: 'Who should Marketing re-engage this month?',
    used: ['behavior', 'engagement', 'identity'], identity: true,
    meter: 'Fading signals per account',
    bars: [{ name: 'Fabrikam', value: 3 }, { name: 'Contoso', value: 1 }, { name: 'Northwind Traders', value: 0 }],
    answer: ['Fabrikam', 'Going quiet:', 'orders slowing,', 'emails unopened,', 'renewal is near.'],
    cites: 'Cites engagement, behavior',
    heading: 'A different question reads different sources',
    body: 'Re-engagement is about attention fading, so the agent leans on engagement and behavior instead of intent. The same identity sits underneath; the evidence on top changes.',
    note: 'The question decides which signals matter, not the other way round.',
  },
  {
    id: 'split', label: 'Without a shared identity',
    question: 'Which accounts show buying intent this week?',
    used: ['behavior', 'intent'], identity: false,
    meter: 'Intent signals per record',
    bars: [
      { name: 'Northwind Traders', value: 1, fragment: true },
      { name: 'NORTHWIND TRADERS', value: 1, fragment: true },
      { name: 'Northwind Trading Co.', value: 1, fragment: true },
      { name: 'Contoso', value: 2 },
    ],
    answer: ['Nothing to report', 'No account is', 'above the', 'threshold.', ''],
    cites: 'Missed: Northwind',
    heading: 'Without one identity, intent disappears',
    body: 'The same company arrives as three records. Each holds one signal, none crosses the threshold, and the agent confidently reports nothing. The model did not fail. The foundation underneath it did.',
    note: 'This is why the identity work sits underneath the agents.',
  },
] as const satisfies readonly {
  id: string; label: string; question: string; used: readonly SourceId[]; identity: boolean;
  meter: string; bars: readonly Bar[]; answer: readonly string[]; cites: string;
  heading: string; body: string; note: string;
}[];
