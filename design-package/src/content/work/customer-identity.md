---
title: "Many records. One customer picture."
subtitle: "A shared identity foundation for sales, marketing, fraud, and applied AI."
date: "2026-10-02"
status: draft
group: professional
order: 2
illustration: identity
category: "Data architecture · identity · governance"
summary: "A customer golden record brings tens of millions of source records into a shared organization-level view."
decision: "Resolve identity once, with deletion and retention considered alongside matching."
sourceLabel: "Supplied DE and FDE résumés · professional experience"
evidenceLabel: "Walmart Global Tech · résumé account"
evidenceNote: "Organization counts and stakeholder scope are reported in my supplied résumés. They have not been independently audited for this site. The illustration is conceptual and contains no real customer data."
caption: "Conceptual sketch: several source records resolve into one shared organization identity."
metrics:
  - value: "1.8M"
    label: "distinct organizations"
  - value: "150+"
    label: "sales, marketing & fraud stakeholders"
---

## One organization can leave many traces

Internal systems and third-party providers can describe the same customer differently. Names vary. Addresses vary. Each source carries its own version of the relationship.

A useful organization-level view has to bring those records together without treating every row as a new customer. My résumés describe architecting the B2B customer golden record identity system for that problem.

## My contribution

The system consolidated tens of millions of source records into 1.8 million distinct organizations using fuzzy address and name matching. The resulting identity layer serves more than 150 stakeholders across sales, marketing, and fraud.

My FDE résumé describes the same layer as grounding for go-to-market AI agents. That makes identity part of both the reporting foundation and the context used by applications above it.

## The decision: identity and governance belong together

Matching creates a shared view, but the lifecycle of that view matters too. The work included data deletion and retention workflows. A golden record has to remain useful as its source data and obligations change.

This story stays at the architecture level. It does not publish matching thresholds, source-provider details, internal schemas, or examples of customer records.

## Make the customer picture useful to the business

Related work included an industry classification engine combining firmographic signals, NAICS rules, and similarity-scored matching. My résumés report 93% accuracy for that engine, without including the evaluation methodology.

I also built lead-source tagging and segmentation across four vendor sources, routing more than 14,000 inbound leads to the appropriate sales segment. The connection is practical: a shared identity becomes more valuable when teams can use it to understand an account and decide what happens next.

## What the numbers mean

The organization and stakeholder counts describe scope reported in my résumés. They are not a measure of matching precision. The classification accuracy is a separate résumé-reported result, and should not be read as the accuracy of identity resolution.
