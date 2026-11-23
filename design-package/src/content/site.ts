export const site = {
  name: 'Sudharsana',
  fullName: 'Sudharsana Rajasekaran',
  role: 'Staff Data Engineer',
  introduction: 'I build data platforms that help teams agree on who their customers are and how to measure their work. At Walmart Global Tech, my work connects customer identity, attribution and applied AI.',
  curiosity: 'The part that keeps pulling me in is everything around the model. What should a system remember? When should it reach for a tool, and when should it admit it cannot know? How do you check an answer before someone acts on it? I like making those choices visible, then testing the assumptions behind them.',
  biography: 'I’m Sudharsana Rajasekaran. I build data and AI systems with one eye on the technical details and the other on the people using them. I enjoy following a problem all the way through: listening, finding the shape of it, building something useful, and learning from what happens next.',
  career: 'My path has taken me through business intelligence, telecom analytics, data center infrastructure, and B2B platforms. That experience shapes how I approach AI today: with care for the data underneath, the decisions it supports, and the responsibility of running the system. My personal projects give that curiosity more room to roam.',
  linkedin: 'https://www.linkedin.com/in/sudharsanarajasekaran/',
  github: 'https://github.com/Sudhan30',
  blog: 'https://blog.sudharsana.dev',
};
export const projects = [
  {
    name: 'BabbleScribe',
    url: 'https://babblescribe.com/',
    illustration: 'voice',
    displayLabel: 'Android app · private voice typing',
    category: 'Voice typing · privacy · on-device AI',
    summary: 'Private voice typing for Android. Dictate in any app with a voice keyboard or floating mic. Speech is recognized on the phone, on your own server, or with a service you choose, and polishing runs on the phone. It supports many languages, with no ads, no tracking and no account.',
    description: 'Private voice typing for Android: dictate in any app, with speech handled on your phone, your own server or a service you choose. No ads, no tracking, no account.',
    linkLabel: 'Visit BabbleScribe',
  },
] as const;
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
