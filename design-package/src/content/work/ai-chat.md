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
summary: "A conversation system exploring what to remember, when to search, and how to make the response useful."
decision: "Summarize earlier dialogue; keep recent context close."
evidenceLabel: "Architecture article · February 2026"
evidenceNote: "The public article documents architecture and code examples. It does not establish current deployment health or independently measured performance."
caption: "Earlier dialogue and recent messages contribute to the context sent to the model."
displayLabel: "Personal project · conversation systems"
---

## Build around the conversation

A chat interface is simple on the surface. Underneath it are choices about memory, context, search, presentation, and what happens when a feature fails.

I built a chat system to explore those choices together, using local inference and a persistent conversation layer.

## The decision: give memory a budget

Earlier dialogue is summarized in the background, while recent messages stay close to the next response. The aim is to carry forward intent, decisions, and open questions without sending an ever-growing history on every turn.

The interesting part is deciding what matters enough to remember.

## Make the surrounding system useful

Selective search brings in fresh information when the conversation needs it. A separate rendering layer gives responses a readable shape. Failure handling helps the interface explain when a capability is unavailable.

These details shape the experience as much as the model itself.

## Keep following the questions

This project gives me a place to explore the connection between system design and a human conversation: what the application knows, how it uses that context, and how clearly it communicates its limits.
