// An affiliate click's path to the channel view. Every number here is
// illustrative: the stages and checks come from the work, the data does not.

export type StageState = 'ok' | 'fail' | 'idle' | 'focus';
export interface Stage { id: string; label: string; }

export const stages = [
  { id: 'channel', label: 'Channel' },
  { id: 'ingest', label: 'Ingest' },
  { id: 'dedupe', label: 'Dedupe' },
  { id: 'join', label: 'Join orders' },
  { id: 'attribute', label: 'Attribution' },
  { id: 'fresh', label: 'Freshness' },
] as const satisfies readonly Stage[];
export type StageId = typeof stages[number]['id'];

/** Illustrative daily values for the channel view; the last one is today. */
export const week = [
  { day: 'Mon', value: 118 }, { day: 'Tue', value: 131 }, { day: 'Wed', value: 109 },
  { day: 'Thu', value: 140 }, { day: 'Fri', value: 126 }, { day: 'Sat', value: 137 },
  { day: 'Today', value: 133 },
] as const;

export const journey = [
  { id: 'search', label: 'Search' },
  { id: 'email', label: 'Email' },
  { id: 'affiliate', label: 'Affiliate' },
] as const;
export type Touch = typeof journey[number]['id'];

export interface Plan {
  /** What each stage reads after the run. */
  states: Record<StageId, StageState>;
  notes: Record<StageId, string>;
  /** How far the click travels; the stage it stops at. */
  stopsAt: StageId | 'view';
  panel: 'view' | 'credit';
  today: 'published' | 'held';
  credit?: Touch;
}

const clean: Plan['notes'] = { channel: 'clicks', ingest: 'on time', dedupe: 'unique', join: 'matched', attribute: 'last touch', fresh: 'current' };
const allOk: Plan['states'] = { channel: 'ok', ingest: 'ok', dedupe: 'ok', join: 'ok', attribute: 'ok', fresh: 'ok' };

export const plans: Record<string, Plan> = {
  normal: { states: allOk, notes: clean, stopsAt: 'view', panel: 'view', today: 'published' },
  late: {
    states: { ...allOk, ingest: 'fail', fresh: 'fail' },
    notes: { ...clean, ingest: 'file late', fresh: 'view held' },
    stopsAt: 'fresh', panel: 'view', today: 'held',
  },
  credit: {
    states: { ...allOk, fresh: 'idle', attribute: 'focus' },
    notes: { ...clean, fresh: 'waiting' },
    stopsAt: 'attribute', panel: 'credit', today: 'published', credit: 'affiliate',
  },
  first: {
    states: { ...allOk, fresh: 'idle', attribute: 'focus' },
    notes: { ...clean, attribute: 'first touch', fresh: 'waiting' },
    stopsAt: 'attribute', panel: 'credit', today: 'published', credit: 'search',
  },
};

export const scenarios = [
  {
    id: 'normal', label: 'A normal day',
    heading: 'Clicks become a number someone trusts',
    body: 'Partner clicks arrive, duplicates fall out, and each click is joined to the orders that followed it. Attribution assigns the credit, and today’s bar joins the channel view.',
    note: 'The pipeline’s job ends where a person reads the result. That is where it gets judged.',
  },
  {
    id: 'late', label: 'A late partner file',
    heading: 'Hold the view, raise the flag',
    body: 'One partner’s file has not arrived. Publishing anyway would draw a quiet dip that looks like a bad day for the channel. The freshness check holds today’s bar and tells the team the data is late.',
    note: 'A missing number is easier to act on than a wrong one.',
  },
  {
    id: 'credit', label: 'Who gets the credit?',
    heading: 'Agree on the rule before the code',
    body: 'This customer searched, opened an email, then clicked an affiliate link and ordered. Under last touch, the affiliate click earns the credit. That rule was agreed with sales leadership before anything was built.',
    note: 'Switch the rule to first touch below and watch the same order change hands.',
  },
] as const;

export const firstTouchPanel = {
  id: 'first', heading: 'Same journey, different winner',
  body: 'Under first touch the order belongs to search, and the affiliate channel suddenly looks weaker. Neither rule is wrong; they answer different questions.',
  note: 'Agreeing on one rule up front keeps every report telling the same story.',
} as const;
