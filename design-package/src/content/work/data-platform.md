---
title: "A backup you have not restored is a hope"
subtitle: "The nightly pipeline that checks my homelab’s database backup by actually restoring part of it."
date: "2026-09-27"
status: draft
group: personal
order: 2
illustration: platform
figure: verified-backup
source: "https://blog.sudharsana.dev/post/k3s-blog-architecture"
sourceLabel: "Read how the platform is built"
category: "Orchestration · verification · operations"
summary: "Every night a pipeline restores a database from last night’s backup into a scratch copy, compares it with the live one, and alerts when anything is off."
decision: "Prove the backup by restoring it, on a schedule, from somewhere the backup does not depend on."
evidenceLabel: "Homelab infrastructure repository · September 2026"
evidenceNote: "Steps, limits, and the failure history come from the private infrastructure repository. Database names and hosts are deliberately omitted."
caption: "The steps, limits, and failure cases come from the real job. The run shown is illustrative."
closing: "A green status is a claim. A restore is evidence."
displayLabel: "Personal project · data platform"
---

## Two machines, one platform

At home I run a small two-node Kubernetes cluster: a mini PC and a GPU workstation. It hosts my blog, my chat agent, Airflow, monitoring, and LLM tracing, all deployed through GitOps with encrypted secrets and single sign-on in front of every interactive service.

It is where I practice the parts of data engineering that only show up when you are the one on call.

## The backup that looked healthy

A scheduled job dumps the databases every night at 03:00. For a long time that was the whole story, and that was the problem. A backup can be on time, the right size, and still impossible to restore.

## Restore it, every night

At 04:00 a pipeline checks the newest dump. Is it under 26 hours old? Does the archive pass an integrity test? Are all six databases inside it?

Then it does the part a cron job cannot. It really restores one database into a scratch database, stopping at the first error, compares the result with the live database, and drops the scratch copy whatever happens.

## Why the restore step earns its keep

The failure it catches looks perfect. A dump taken with a newer Postgres client contains a setting the older server rejects. The file is fresh, intact, and complete. It fails only when you try to restore it, which is exactly when you can least afford to find out.

Play “The wrong client” above and watch every early check pass.

## Put the check where the failure is not

The dump stays a plain scheduled job on purpose. Airflow depends on the same database server, so an Airflow-driven backup could not run during the failure it exists for. Verification has the opposite shape: if Airflow is down, I lose the check, not the backup.

## Alert on the alerting

A different job taught me the last lesson. Comment summaries failed 483 times in a row, from March to August, and nobody knew. Its alerts went to a notification service that had been deleted. Failures now go somewhere a person reads, and a quiet channel is something I check, not something I trust.
