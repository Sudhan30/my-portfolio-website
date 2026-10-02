export const site = {
  name: 'Sudharsana',
  fullName: 'Sudharsana Rajasekaran',
  headline: [{ lead: 'Curious by ', emphasis: 'nature.' }, { lead: 'A builder by ', emphasis: 'choice.' }],
  introduction: 'I explore AI systems, inference, and the engineering that turns a model into something useful. This is a small collection of things I build, questions I follow, and decisions along the way.',
  curiosity: 'The part that keeps pulling me in is everything around the model. What should a system remember? When should it reach for a tool? What happens when a request has to wait? I like making those choices visible, then testing the assumptions behind them.',
  biography: 'I’m Sudharsana Rajasekaran. I come to AI systems through data engineering: moving information, understanding its limits, and making it useful to someone on the other end. My personal projects give me a place to follow a question from an idea to the details of how it works.',
  career: 'My background spans business intelligence and data engineering, with work described in my earlier portfolio at Cognizant, Ericsson, Google as a contractor, and Walmart Global Tech. Today, this space focuses on the systems questions I explore through my own projects.',
  linkedin: 'https://www.linkedin.com/in/sudharsanarajasekaran/',
  github: 'https://github.com/Sudhan30',
  blog: 'https://blog.sudharsana.dev',
};
export const selectedWork = [
  {
    number: '01', category: 'Memory · orchestration · interfaces', kind: 'chat',
    title: 'The system around the conversation',
    description: 'An AI chat architecture that treats memory as a resource and failure as part of the experience.',
    decision: 'The decision: summarize earlier dialogue; keep recent context close.',
    href: '/work/ai-chat/', linkLabel: 'Explore the story',
    evidence: 'Architecture article · February 2026',
  },
  {
    number: '02', category: 'Agents · SQL · boundaries', kind: 'sql',
    title: 'A question becomes a query',
    description: 'A documented text-to-SQL experiment separating conversation from structured tool calls.',
    decision: 'The decision: focused model contexts, with query checks before execution.',
    href: 'https://github.com/Sudhan30/my-blog-site-sudhanverse/blob/main/content/posts/text-to-sql-agent.md',
    linkLabel: 'Read the source article', evidence: 'Architecture article · March 2026',
  },
  {
    number: '03', category: 'Data freshness · tooling · evidence', kind: 'probe',
    title: 'An endpoint can be up. Is its data fresh?',
    description: 'freshprobe explores the gap between a successful response and information an agent should rely on.',
    decision: 'The decision: inspect freshness signals alongside endpoint liveness.',
    href: 'https://github.com/Sudhan30/freshprobe', linkLabel: 'Explore the repository',
    evidence: 'Public repository · capabilities described in its README',
  },
] as const;
