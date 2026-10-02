---
title: "A question becomes a query"
subtitle: "An experiment in separating conversation, tool calls, and the database boundary."
date: "2026-03-11"
status: draft
group: personal
order: 2
illustration: sql
category: "Agents · SQL · boundaries"
summary: "A local text-to-SQL experiment uses two focused model contexts to turn a data question into a proposed query."
decision: "Separate conversational intent from SQL generation, then check the proposed query."
source: "https://github.com/Sudhan30/my-blog-site-sudhanverse/blob/main/content/posts/text-to-sql-agent.md"
sourceLabel: "Read the text-to-SQL article"
evidenceLabel: "Architecture article · March 2026"
evidenceNote: "The article documents a dated experiment, not a current security or accuracy assessment. Its examples do not establish that every generated query is correct or safe."
caption: "A proposed query passes through an application boundary before reaching data."
---

## A small question with a repetitive path

Checking a blog metric meant opening a terminal, connecting to the server, entering the database, and writing a query. I wanted to ask the same question through the chat interface I was already using.

My March 2026 article describes the resulting text-to-SQL experiment: conversational intent becomes a structured tool request, query results return to the application, and the response is presented in natural language.

## My contribution

I built the orchestration described in the article around two local models. Gemma3 handled conversational intent and presentation. Qwen3 handled structured tool calls with schema context.

The design gave the conversational model short tool descriptions and gave the query model the database schema. Each context was shaped for the responsibility of that stage.

## The decision: give each stage a focused job

The separation makes the application flow easier to reason about: understand the question, propose a query, apply the execution boundary, then present the result. It also introduces extra orchestration and model calls when a data question needs the full path.

That tradeoff needs to be measured against a simpler baseline. The article explains the design choice; it does not establish a general advantage for two models over one.

## The boundary needs its own evidence

The article describes a read-only database user, SQL validation, query limits, and connection timeouts. A generated query still needs controls outside the model.

The shown keyword checks are examples, rather than a proof that every SQL construct is handled safely. A production assessment would need to inspect actual permissions, parsing, execution limits, and failure cases. This story does not claim that those checks have been completed.

## What I take from the experiment

A conversational interface can make a familiar task more convenient, while leaving correctness and authorization as separate engineering responsibilities. Keeping those responsibilities explicit is the part of the design I want to carry forward.
