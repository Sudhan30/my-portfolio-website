export const site = {
  name: 'Sudharsana',
  fullName: 'Sudharsana Rajasekaran',
  headline: [{ lead: 'Curious by ', emphasis: 'nature.' }, { lead: 'A builder by ', emphasis: 'choice.' }],
  introduction: 'I’m a Staff Data Engineer working across data platforms and applied AI. I turn business questions into systems people can use—from the data underneath to the agents and interfaces on top.',
  curiosity: 'The part that keeps pulling me in is everything around the model. What should a system remember? When should it reach for a tool? What happens when a request has to wait? I like making those choices visible, then testing the assumptions behind them.',
  biography: 'I’m Sudharsana Rajasekaran. Over more than a decade in retail, tech, and telecom, I’ve worked from business intelligence through large-scale data platforms to applied AI. I’m interested in the whole path: understanding the problem with the people facing it, building the system, and taking responsibility for how it behaves.',
  career: 'My work has included client-facing BI delivery at Cognizant, analytics and computer vision at Ericsson, data engineering for Google’s data center organization as a contractor, and B2B platforms and GenAI at Walmart Global Tech. My personal projects keep that same curiosity going beyond the day job.',
  linkedin: 'https://www.linkedin.com/in/sudharsanarajasekaran/',
  github: 'https://github.com/Sudhan30',
  blog: 'https://blog.sudharsana.dev',
};
export const careerScale = [
  { value: '50+', label: 'production pipelines', context: 'Across the B2B data platform' },
  { value: '1.8M', label: 'distinct organizations', context: 'In the customer golden record' },
  { value: '$750M+', label: 'order GMV surfaced', context: 'For revenue intelligence and reporting' },
] as const;
export const approach = [
  { number: '01', title: 'Start with the people.', description: 'Technical discovery with Sales, Marketing, and RevOps helps define the question before choosing the system. Attribution rules and agent use cases both start here.' },
  { number: '02', title: 'Build the foundation.', description: 'Identity, reliable pipelines, and curated behavior and intent datasets give reporting and AI something useful to work with. The quality of that foundation shapes everything above it.' },
  { number: '03', title: 'Stay for the hard parts.', description: 'Delivery includes evaluation, observability, and incident response. My experience spans GenAI usage telemetry, freshness SLOs, and P0/P1 incident command.' },
] as const;
