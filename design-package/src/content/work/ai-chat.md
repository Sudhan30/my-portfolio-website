---
title: "The system around the conversation"
subtitle: "A self-hosted chat agent that checks whether it needs live data before it speaks, and keeps its database tools behind a boundary."
date: "2026-09-27"
status: draft
source: "https://blog.sudharsana.dev/post/building-ai-chat-system"
sourceLabel: "Read where it started: the February 2026 article"
illustration: chat
figure: decide-answer
group: personal
order: 1
category: "Agents · grounding · SQL boundaries"
summary: "A self-hosted chat agent that scores every question, reaches for a tool when the answer lives in a real system, and says so when nothing can see it."
decision: "Decide whether a tool is needed before the model answers, in plain code that can be tested."
evidenceLabel: "Private repository · September 2026"
evidenceNote: "Scores in the figure come from running the app's own grounding function on each question. The linked article predates the current design."
caption: "Scores come from running the chat app’s real grounding function on each question. Answers and data are illustrative."
closing: "The interesting part was never the model. It was everything that decides what the model may say."
displayLabel: "Personal project · conversation systems"
---

## The answer that started it

I asked my own chat app for the CPU temperature of my server. It replied with a neat table of five pods, their namespaces, and their restart counts. Every row was invented. No tool had been called, and nothing in the system had asked whether one should be.

## A gate before the model speaks

Now every question is scored before any model call. A live subject or a metric adds two points. Words like “my” or “right now” add two. State verbs add one. Framing like “explain” takes two away. A tool is required when a live subject fires and the score reaches three.

It is a word list and some arithmetic, with no network calls, so it can be tested exhaustively for free.

The threshold leans toward calling a tool on purpose. An unnecessary call costs a fraction of a second. A confident, invented answer about my own infrastructure costs far more.

## Knowing what it cannot see

Some questions point at things no tool can read. Asked how many alerts fired last week, the agent says it has no tool that can see alerts, instead of answering with pod counts. That refusal is a designed path in the graph, not a model’s mood.

## A boundary the model cannot talk its way past

The SQL tool began as a separate text-to-SQL experiment and is now one of the agent’s tools. Its boundary lives outside the model: SELECT only, no comments, no stacked statements, every query wrapped with a row limit, all of it inside a read-only transaction with a ten second timeout. Rows are redacted before the model reads them.

Asked to delete spam comments, the model can propose the query. The boundary turns it down.

## Memory with a budget

Long conversations get a rolling summary every ten messages: detailed at first, briefer after fifty. Recent messages stay close. The model gets enough to keep going without the whole history on every turn.

## Measured, not assumed

Changes run against a tiered set of test questions. Some have a checkable right answer. Some have no tool that could answer them, where saying so is correct. Some are plain conversation, where calling a tool is wrong. Scoring follows fixed rules, not another model’s opinion.
