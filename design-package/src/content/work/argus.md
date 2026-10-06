---
title: "Rules decide. The model annotates."
subtitle: "A security monitor for my homelab where code sets every severity and silence counts as a finding."
date: "2026-09-22"
status: draft
group: personal
order: 3
illustration: sentinel
figure: severity-gate
category: "Security monitoring · rules · operations"
summary: "Argus watches my homelab around the clock. Deterministic rules set every severity. A model may add a note, never change a level."
decision: "Keep the model out of the path that wakes a person up."
sourceLabel: "Private repository"
evidenceLabel: "Argus repository and decision records · September 2026"
evidenceNote: "The figure shows design principles with synthetic events. Detections, thresholds, and topology are deliberately omitted."
caption: "Synthetic events. The figure shows how Argus decides, not what it detects."
closing: "A monitor earns trust by being honest about what it cannot see."
displayLabel: "Personal project · security monitoring"
---

## Signals everywhere, nobody watching

Security signal in my homelab existed in pieces: logs, metrics, the sign-in gate, cloud accounts. Nothing watched all of it, connected it, or told me when something mattered. Argus is the system I built to do that.

Its first phase has been live since September 2026. The rest arrives in phases, each one behind its own decision record.

## Severity is code

Deterministic rules are the only place a severity is set. A HIGH finding goes straight to email. MEDIUM findings are batched. By design, a local model may annotate a batch to make it easier to read, but it can never raise or lower a level, and it never sits in the HIGH path.

The model helps me read. It does not decide what is urgent.

## Blind is not zero

When a source cannot be read, Argus reports it as blind. A failed read never turns into a reassuring zero. “No failed sign-ins” and “could not read the sign-ins” lead to very different nights.

## Who watches the watcher

A small sentry runs off-site. If the monitor at home goes quiet, the sentry notices and emails me directly. Silence is treated as a finding.

## Alerts fail open, actions fail closed

An alert that might be a duplicate is still worth sending. An action that cannot be recorded is not worth taking. Containment is limited to a few reversible, rule-chosen actions, and each one is proven in shadow mode before it may act.

## Rehearse before launch

A launch rehearsal found one path where an alert about the monitor itself could be lost. Launch waited until it was fixed.
