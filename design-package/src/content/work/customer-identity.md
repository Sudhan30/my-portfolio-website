---
title: "Many records. One customer picture."
subtitle: "A shared identity foundation for sales, marketing, fraud, and applied AI."
date: "2026-10-02"
status: draft
group: professional
order: 1
illustration: identity
figure: resolve-records
category: "Data architecture · identity · governance"
summary: "One golden record turns tens of millions of source records into a customer picture that sales, marketing, and fraud teams share."
decision: "Treat matching as a dial with two kinds of mistake, and make deletion part of the same system."
sourceLabel: "Supplied DE and FDE résumés · professional experience"
evidenceLabel: "Walmart Global Tech · résumé account"
evidenceNote: "Organization counts and stakeholder scope are reported in my supplied résumés. They have not been independently audited for this site. The playable figure uses invented companies and contains no real customer data."
caption: "Invented companies. The strictness setting decides which mistake you make: merging two businesses, or splitting one."
closing: "Two teams looking at the same customer should see the same customer."
metrics:
  - value: "1.8M"
    label: "distinct organizations"
  - value: "150+"
    label: "sales, marketing & fraud stakeholders"
displayLabel: "Walmart Global Tech · customer identity"
---

## The same company, written five ways

Northwind Traders Inc. in one system. NORTHWIND TRADERS in another. Northwind Trading Co. at a new address after a move. Every team had its own version, and they did not agree on how many customers the business had.

## One golden record

I built the customer identity foundation that brings those pieces together. Tens of millions of source records resolve into 1.8 million distinct organizations, and more than 150 people across sales, marketing, and fraud work from that shared picture.

It is also the base the go-to-market agents stand on.

## The judgment: where to draw the line

Matching is a dial, not a switch. Set it loose and two different businesses with similar names become one customer. That mistake is worse than a duplicate, because nobody notices it. Set it strict and the same company stays split by an abbreviation or an old address.

Try the strictness control above. The right setting keeps both mistakes rare, and the cost of each one decides which way to lean.

## Identity is a lifecycle

A record keeps changing after its first match. Companies move, merge, and ask to be forgotten. I treated retention and deletion as part of the same system as matching: when a source record has to go, the shared picture has to change with it.

## Making it useful

Industry classification, lead segmentation, and routing sit on top of the identity. They answer everyday questions: which team should follow up, what an account needs, and where an opportunity belongs.
