export const site = {
  name: 'Sudharsana',
  fullName: 'Sudharsana Rajasekaran',
  headline: [{ lead: 'Curious by ', emphasis: 'nature.' }, { lead: 'A builder by ', emphasis: 'choice.' }],
  introduction: 'I’m a Staff Data Engineer working across data platforms and applied AI. I turn business questions into systems people can use—from the data underneath to the agents and interfaces on top.',
  curiosity: 'The part that keeps pulling me in is everything around the model. What should a system remember? When should it reach for a tool? What happens when a request has to wait? I like making those choices visible, then testing the assumptions behind them.',
  biography: 'I’m Sudharsana Rajasekaran. I build data and AI systems with one eye on the technical details and the other on the people using them. I enjoy following a problem all the way through: listening, finding the shape of it, building something useful, and learning from what happens next.',
  career: 'My path has taken me through business intelligence, telecom analytics, data center infrastructure, and B2B platforms. That experience shapes how I approach AI today: with care for the data underneath, the decisions it supports, and the responsibility of running the system. My personal projects give that curiosity more room to roam.',
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
  { number: '01', title: 'Start with the people.', description: 'I work with the people closest to a problem to understand the decision they need to make. A clear question gives the engineering a purpose.' },
  { number: '02', title: 'Build the foundation.', description: 'I connect the right data, give it a useful shape, and build a dependable path through the system. That foundation supports the reporting and AI experiences above it.' },
  { number: '03', title: 'Stay for the hard parts.', description: 'I stay involved after delivery: watching how the system is used, responding when it fails, and turning what we learn into a better next version.' },
] as const;
