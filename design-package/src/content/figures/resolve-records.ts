// Resolve the records: eight illustrative source records, three matching rules
// and a deletion request. The companies and addresses are invented. The rules
// are deliberately simple and deterministic, so the figure can show what each
// one gets right and wrong; real identity resolution weighs far more evidence.

export const records = [
  { id: 1, name: 'Northwind Traders Inc.', address: '12 Harbor St, Seattle', attribute: 'Harbor St' },
  { id: 2, name: 'NORTHWIND TRADERS', address: '12 Harbor Street, Seattle', attribute: 'Harbor St' },
  { id: 3, name: 'Northwind Traders', address: 'PO Box 88, Seattle', attribute: 'PO Box 88' },
  { id: 4, name: 'Northwind Dental', address: '40 Pine Ave, Tacoma', attribute: 'Pine Ave' },
  { id: 5, name: 'Contoso Ltd', address: '9 Main St, Austin', attribute: 'Main St' },
  { id: 6, name: 'Contoso Limited', address: '9 Main Street, Austin', attribute: 'Main St' },
  { id: 7, name: 'Fabrikam Inc.', address: '300 Lake Rd, Denver', attribute: 'Lake Rd' },
  { id: 8, name: 'Fabrikam, Incorporated', address: '300 Lake Road, Denver', attribute: 'Lake Rd' },
] as const;

export type Level = 'loose' | 'balanced' | 'strict';
export const levels: readonly { id: Level; label: string; rule: string }[] = [
  { id: 'loose', label: 'Loose', rule: 'Same first word of the name' },
  { id: 'balanced', label: 'Balanced', rule: 'Same name without case, punctuation or legal suffix, in the same city' },
  { id: 'strict', label: 'Strict', rule: 'Balanced, and the same street address' },
];

/** `odd` marks the member the rule got wrong: the joined stranger, or the split-off record. */
export interface Organization { name: string; members: number[]; flag?: 'over' | 'split'; odd?: number[]; }

/** Cluster assignments per rule, precomputed from the rules above. */
const clusters: Record<Level, Organization[]> = {
  loose: [
    { name: 'Northwind Traders', members: [1, 2, 3, 4], flag: 'over', odd: [4] },
    { name: 'Contoso', members: [5, 6] },
    { name: 'Fabrikam', members: [7, 8] },
  ],
  balanced: [
    { name: 'Northwind Traders', members: [1, 2, 3] },
    { name: 'Northwind Dental', members: [4] },
    { name: 'Contoso', members: [5, 6] },
    { name: 'Fabrikam', members: [7, 8] },
  ],
  strict: [
    { name: 'Northwind Traders', members: [1, 2] },
    { name: 'Northwind Traders', members: [3], flag: 'split', odd: [3] },
    { name: 'Northwind Dental', members: [4] },
    { name: 'Contoso', members: [5, 6] },
    { name: 'Fabrikam', members: [7, 8] },
  ],
};

export const maxOrganizations = 5;

/** The golden records for a rule, after any deleted source records leave. */
export function resolve(level: Level, deleted: boolean) {
  const gone = deleted ? new Set([3]) : new Set<number>();
  const orgs = clusters[level]
    .map((org) => ({ ...org, members: org.members.filter((id) => !gone.has(id)) }))
    .filter((org) => org.members.length > 0)
    .map((org) => ({
      ...org,
      attributes: [...new Set(org.members.map((id) => records.find((record) => record.id === id)!.attribute))],
    }));
  const clusterOf = new Map<number, number>();
  orgs.forEach((org, index) => org.members.forEach((id) => clusterOf.set(id, index)));
  const odd = new Set(orgs.flatMap((org) => org.odd ?? []));
  return { orgs, clusterOf, odd, remaining: records.length - gone.size };
}

export const scenarios = [
  {
    id: 'balanced', label: 'Balanced', level: 'balanced', deleted: false,
    heading: 'Eight records, four organizations',
    body: 'Ignore case, punctuation and legal suffixes, and require the same city. The three Northwind Traders records become one organization, and Northwind Dental stays its own business.',
    note: 'The golden record keeps every useful address: the street office and the mailing box.',
  },
  {
    id: 'loose', label: 'Loose', level: 'loose', deleted: false,
    heading: 'Too eager: two businesses become one',
    body: 'Matching on the first word alone pulls a dental clinic in Tacoma into Northwind Traders. Sales would call the wrong company, and fraud checks would mix two histories.',
    note: 'An over-merge is the expensive mistake. It is hard to see and harder to undo.',
  },
  {
    id: 'strict', label: 'Strict', level: 'strict', deleted: false,
    heading: 'Too careful: one business becomes two',
    body: 'Requiring the same street address splits off the record that only has a mailing box. Its signals now belong to a second Northwind Traders that nobody owns.',
    note: 'An under-merge is quieter. It shows up later as a missed signal or a duplicate call.',
  },
  {
    id: 'delete', label: 'A deletion request', level: 'balanced', deleted: true,
    heading: 'Identity includes forgetting',
    body: 'A deletion request removes one source record. The organization survives, but the golden record is rebuilt from what remains, so the mailing box it came with disappears too.',
    note: 'Matching, retention and deletion are one system. A golden record has to stay true as its sources change.',
  },
] as const satisfies readonly { id: string; label: string; level: Level; deleted: boolean; heading: string; body: string; note: string }[];

export const customPanel = {
  id: 'custom', heading: 'Your rule',
  body: 'Each rule is a trade. Looser rules join more records and risk merging different businesses. Stricter rules protect against that and risk splitting one business in two.',
  note: 'The right rule depends on which mistake costs the teams using it more.',
} as const;
