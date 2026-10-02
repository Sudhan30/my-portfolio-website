---
title: "A question becomes a query"
subtitle: "An experiment in separating conversation, tool calls, and the database boundary."
date: "2026-03-11"
status: draft
group: personal
order: 2
illustration: sql
category: "Agents · SQL · boundaries"
summary: "A familiar database question becomes a conversation, with focused steps for understanding, retrieval, and presentation."
decision: "Separate conversational intent from SQL generation, then check the proposed query."
source: "https://github.com/Sudhan30/my-blog-site-sudhanverse/blob/main/content/posts/text-to-sql-agent.md"
sourceLabel: "Read the text-to-SQL article"
evidenceLabel: "Architecture article · March 2026"
evidenceNote: "The article documents a dated experiment, not a current security or accuracy assessment. Its examples do not establish that every generated query is correct or safe."
caption: "A proposed query passes through an application boundary before reaching data."
displayLabel: "Personal project · conversational data tools"
---

## Make a familiar task easier

Checking a simple database metric meant opening a terminal, connecting to the server, and writing a query. I wanted to ask the same question through a conversation.

I built a local text-to-SQL experiment that connects a natural-language question to a proposed query and a readable answer.

## Give each stage a focused job

One model handles conversational intent and presentation. Another works with the schema and structured tool calls. The application connects the stages and decides how a proposed query reaches the database.

That separation keeps the responsibilities visible: understand the question, retrieve the data, and explain the result.

## Put control around the tool

Read-only access, query checks, and execution limits sit outside the model. A convenient interface still needs an explicit boundary around what it can do.

## Bring the answer back to the person

The result returns to the conversation, where it can be presented in a useful form. The project explores how a small, repetitive workflow can become easier to use while keeping its engineering responsibilities clear.
