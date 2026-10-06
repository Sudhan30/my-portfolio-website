---
title: "An endpoint can be up. Is its data fresh?"
subtitle: "An open source probe that tells an agent whether a response is current, not just available."
date: "2026-04-02"
status: draft
group: personal
order: 4
illustration: probe
figure: fresh-vote
category: "Data freshness · tooling · evidence"
summary: "freshprobe checks the evidence behind a successful response and returns a repeatable verdict an agent can act on: FRESH, STALE, or UNKNOWN."
decision: "Answer UNKNOWN when the signals disagree, instead of guessing."
source: "https://github.com/Sudhan30/freshprobe"
sourceLabel: "Explore the freshprobe repository"
evidenceLabel: "Public repository · v0.2.0"
evidenceNote: "Behavior is described from the public repository at v0.2.0 (April 2026). The figure ports its verdict code; no independent performance claim is made."
caption: "The vote, thresholds, and confidence weights are ported from freshprobe’s open source verdict code. The endpoint is illustrative."
closing: "Before an agent acts, it should know how old its facts are."
displayLabel: "Personal project · data freshness"
---

## Up is not the same as current

An agent asks an API for flight prices and gets HTTP 200. The fare changed three hours ago. Nothing in a status code says so.

## Four signals, one vote

freshprobe reads the cache headers, fingerprints the body across repeated requests, checks that latency is steady, and compares the data’s age with a policy: 60 seconds for a real-time API, 24 hours for static content. Each signal votes. At least 70% fresh reads FRESH. 30% or less reads STALE.

## The decision: say UNKNOWN

Between those thresholds, freshprobe answers UNKNOWN and lowers its confidence. A probe that always picks a side is easier to use, and it is wrong in exactly the cases that matter.

Try “A static file” above. Two signals vote each way, and the honest answer is that it does not know.

## Built to be called by agents

It is a single Go binary that runs as a command-line tool, an MCP server, or an HTTP service. The same inputs always produce the same verdict, so an agent can build on it.
