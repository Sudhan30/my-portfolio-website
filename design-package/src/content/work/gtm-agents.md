---
title: "Agents that know which customer they are talking about"
subtitle: "Sales and Marketing agents built on the customer data the business already trusts."
date: "2026-10-02"
status: draft
group: professional
order: 1
illustration: agents
figure: ask-account
category: "Applied AI · technical discovery · delivery"
summary: "Sales and Marketing agents answer questions about accounts from curated customer signals, joined through one shared customer identity."
decision: "Ground the agents in the shared customer identity before adding anything clever on top."
sourceLabel: "Supplied FDE résumé · professional experience"
evidenceLabel: "Walmart Global Tech · résumé account"
evidenceNote: "This high-level account comes from my supplied FDE résumé. It describes the contribution reported there; it is not an independent evaluation of agent accuracy, adoption, or business impact. Internal implementation details are omitted. The playable figure uses invented accounts."
caption: "Illustrative accounts and signals. The point is the join: every signal reaches the agent through one customer identity."
closing: "The model was the easy part. Knowing the customer was the work."
displayLabel: "Walmart Global Tech · applied AI"
---

## The question behind the question

A seller rarely needs more data. They need a next step: which account is warming up, who has gone quiet, what to say first.

I built Sales and Marketing agents that take those questions in plain language and answer them from the business’s own customer behavior, intent, and engagement data.

## The decision: start from the identity

The tempting version hands raw events to a model and lets it sort them out. I went the other way. The signals are curated first, then joined through the shared customer identity in the next story.

That join is the difference between a useful answer and a confident miss. If one organization lives in three records, its intent splits three ways and no single record looks interesting. Play “Without a shared identity” above to watch the agent walk straight past the account that matters.

## Built for the person using it

The data work sits underneath and the experience sits on top. The interface turns business context into something a seller can use in the middle of a working day.

Around the agents, I built an evaluation and telemetry loop for a customer-facing assistant, reading conversation patterns to decide what to improve next. An internal tool applied the same thinking earlier in the process: checking whether a team’s data is ready before anyone commits engineering time to an AI idea.

## No new source of truth

These agents run on the same platform as the revenue reporting that surfaced more than $750M in order GMV. They did not need a new source of truth. They needed the one the business already had, in a shape a model could use.
