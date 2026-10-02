---
title: "The system around the conversation"
subtitle: "An AI chat architecture with memory, search, and room to fail gracefully."
date: "2026-02-05"
status: draft
source: "https://github.com/Sudhan30/my-blog-site-sudhanverse/blob/main/content/posts/building-ai-chat-system.md"
sourceLabel: "Read the architecture article"
illustration: chat
group: personal
order: 1
category: "Memory · orchestration · interfaces"
summary: "An AI chat architecture that treats memory as a resource and failure as part of the experience."
decision: "Summarize earlier dialogue; keep recent context close."
evidenceLabel: "Architecture article · February 2026"
evidenceNote: "The public article documents architecture and code examples. It does not establish current deployment health or independently measured performance."
caption: "Earlier dialogue and recent messages contribute to the context sent to the model."
---

## A chat box is the beginning

A conversation keeps accumulating decisions, questions, and context. A model has a bounded context window. Sending every earlier message again makes that mismatch harder to manage as a conversation grows.

In my February 2026 architecture article, I described how I approached the surrounding system: what to remember, when to search, how to present a response, and what should happen when a capability fails.

## My contribution

I designed the chat platform described in the article around a Bun/Hono application, local inference through Ollama, and PostgreSQL for conversation state. The article walks through the application flow and the deployment architecture, including background summarization and selective search.

The work crosses the boundary between the model and the product. A response needs useful context, a readable presentation, and an application that can explain when something went wrong.

## The decision: give memory a budget

Earlier dialogue is summarized in the background. Recent messages stay in the working context alongside that summary. This makes the distinction between stored conversation history and the context sent to a model explicit.

There is a tradeoff. A summary can leave something out. The design aims to retain intent, decisions, and unresolved questions, but that aim needs evaluation against real conversations. A smaller context alone does not prove that the right information survived.

## Treat failure as part of the interface

The article describes optional search and a fallback when image processing fails. It also separates generated text from its rendered presentation. These are places where engineering choices become visible to the person using the system.

The principle I want to carry forward is simple: when the system cannot support an answer, the interface should make that limitation understandable.

## What the evidence tells us

The public article is a dated account of architecture and implementation choices. It includes diagrams and code examples. It does not establish current deployment health, latency, cost savings, or independently measured answer quality.

Before making those claims, I would want a defined evaluation set, failure cases, and measurements tied to an exact version of the system. For this story, the evidence is the documented design and the reasoning behind it.
